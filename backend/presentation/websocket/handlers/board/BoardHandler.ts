// presentation/websocket/handlers/boardHandler.ts
//
// Ответственность:
//   joinBoard    — подписка на board-комнату + hydration полного состояния из Redis
//   board:action — сохранение stroke в Redis, broadcast участникам
//   board:clear  — очистка страницы (erase all), только тьютор
//
// Хранение:
//   Redis List: board:{lessonId}:{pageIndex} → JSON-строки BoardAction
//   TTL = 3 h. При endLesson тьютор должен POST /api/lessons/:id/board/save
//   (сохранение в постоянное хранилище — вне сокет-слоя).
//

// Snapshot:
//   Периодический job и финальный snapshot при endLesson → R2
//   При joinBoard сначала проверять snapshot, затем накладывать Redis-actions
//
// Файлы (изображения на доске):
//   Клиент грузит в R2 через presigned URL → шлёт board:action { type: "image", data: { fileKey } }
//   Сервер не трогает байты файла

import type { Server, Socket } from "socket.io";
import { safeHandler }         from "../../utils/safeHandler";
import { isRateLimited }       from "../../middleware/socketRateLimit";
import redis                   from "../../../../infrastructure/redis/redisClient";
 
// ── Константы ─────────────────────────────────────────────────────────────────
 
const BOARD_TTL_SECONDS  = 60 * 60 * 3; // 3 h — TTL для keys страниц
const MAX_PAGES          = 20;           // п.4: лимит страниц на урок
const MAX_ACTION_DATA_LEN = 10_000;      // п.3: 10 KB на payload одного action
const MAX_ACTIONS_PER_PAGE = 5_000;      // п.5: порог для будущего snapshot-триггера
 
// ── Типы ──────────────────────────────────────────────────────────────────────
 
export type BoardActionType =
  | "brush"
  | "line"
  | "rect"
  | "circle"
  | "text"
  | "erase"
  | "image"; // вставка по R2 fileKey
 
const VALID_ACTION_TYPES = new Set<BoardActionType>([
  "brush", "line", "rect", "circle", "text", "erase", "image",
]);
 
export interface BoardAction {
  lessonId:  string;
  pageIndex: number;
  type:      BoardActionType;
  data:      unknown; // непрозрачный payload — сервер не интерпретирует структуру
  userId:    string; 
  timestamp: number; 
}
 

 
const pageKey   = (lessonId: string, pageIndex: number) => `board:${lessonId}:${pageIndex}`;
const pagesKey  = (lessonId: string)                    => `board:${lessonId}:pages`;
 
 
const saveStroke = async (action: BoardAction): Promise<number> => {
  const k   = pageKey(action.lessonId, action.pageIndex);
  const pk  = pagesKey(action.lessonId);
 
  // индекс страниц
  await redis.sAdd(pk, String(action.pageIndex));
  await redis.expire(pk, BOARD_TTL_SECONDS);
 
  const len = await redis.rPush(k, JSON.stringify(action));
  await redis.expire(k, BOARD_TTL_SECONDS);
 
  return len; 
};
 
// при clearPage чистим и индекс страниц
const clearPage = async (lessonId: string, pageIndex: number): Promise<void> => {
  await redis.del(pageKey(lessonId, pageIndex));
  await redis.sRem(pagesKey(lessonId), String(pageIndex));
};
 
// очистка всех данных доски после endLesson + snapshot
export const clearBoardFromRedis = async (lessonId: string): Promise<void> => {
  const pageIndexes = await redis.sMembers(pagesKey(lessonId));
  const keysToDelete = [
    pagesKey(lessonId),
    ...pageIndexes.map((p) => pageKey(lessonId, Number(p))),
  ];
  if (keysToDelete.length > 0) {
    await redis.del(keysToDelete);
  }
};
 
// Загрузка полного состояния для joinBoard или snapshot
export const loadBoardFromRedis = async (
  lessonId: string,
): Promise<Record<number, BoardAction[]>> => {

  const pageIndexes = await redis.sMembers(pagesKey(lessonId));
  const fullState: Record<number, BoardAction[]> = {};
 
  for (const p of pageIndexes) {
    const pageIndex = Number(p);
    if (Number.isNaN(pageIndex)) continue;
 
    const raw = await redis.lRange(pageKey(lessonId, pageIndex), 0, -1);
    fullState[pageIndex] = raw.map((x) => JSON.parse(x) as BoardAction);
  }
 
  return fullState;
};
 

export const createBoardHandler = (io: Server, socket: Socket): void => {
  const user = socket.data.user as { id: string; activeRole: string } | undefined;
  if (!user) return;
 
  // -- joinBoard ----------------------------------------------------------------
  //
  // Клиент: socket.emit("joinBoard", { lessonId })
  // Сервер: проверяет контекст урока, присоединяет к board-комнате,
  //         шлёт board:fullState со всеми страницами из Redis
  //
  socket.on(
    "joinBoard",
    safeHandler("joinBoard", async (data: { lessonId: string }) => {
      const lessonId = String(data?.lessonId ?? "").trim();
      if (!lessonId) return;
 
      const ctx = socket.data.lessonCtx as
        | { lessonId: string; status: string }
        | undefined;
 
      // п.1: проверяем и принадлежность, и статус урока
      if (!ctx || ctx.lessonId !== lessonId) {
        socket.emit("boardError", { code: "NOT_IN_LESSON" });
        return;
      }
 
      if (!["confirmed", "in_progress"].includes(ctx.status)) {
        socket.emit("boardError", { code: "LESSON_NOT_ACTIVE" });
        return;
      }
 
      await socket.join(`board:${lessonId}`);
 
      // п.2: загружаем через Set-индекс, без redis.keys()
      const fullState = await loadBoardFromRedis(lessonId);
 
      socket.emit("board:fullState", fullState);
    }),
  );
 
  // -- board:action -----------------------------------------------------------------------------
  //
  // Клиент: socket.emit("board:action", { lessonId, pageIndex, type, data })
  // Сервер: валидирует, проставляет userId/timestamp, сохраняет в Redis, broadcast
  //
  socket.on(
    "board:action",
    safeHandler("board:action", async (raw: Omit<BoardAction, "userId" | "timestamp">) => {
      // Rate limit: 200 actions / 10 сек
      if (await isRateLimited(socket, 200, "board:action", 10_000)) return;
 
      const lessonId = String(raw?.lessonId ?? "").trim();
      const ctx = socket.data.lessonCtx as { lessonId: string } | undefined;
      if (!ctx || ctx.lessonId !== lessonId) return;
 
      const pageIndex = Number(raw?.pageIndex);
      if (Number.isNaN(pageIndex) || pageIndex < 0) return;
 
      if (pageIndex >= MAX_PAGES) {
        socket.emit("boardError", { code: "PAGE_LIMIT_EXCEEDED", max: MAX_PAGES });
        return;
      }

      if (!VALID_ACTION_TYPES.has(raw?.type)) {
        socket.emit("boardError", { code: "INVALID_ACTION_TYPE" });
        return;
      }
 
      // п.3: лимит размера payload
      // maxHttpBufferSize=1MB защищает на уровне транспорта,
      // этот лимит — доменное правило конкретно для board action data
      const dataLen = JSON.stringify(raw?.data ?? null).length;
      if (dataLen > MAX_ACTION_DATA_LEN) {
        socket.emit("boardError", { code: "ACTION_TOO_LARGE", maxBytes: MAX_ACTION_DATA_LEN });
        return;
      }
 
      // userId и timestamp проставляет сервер — клиент не может подменить
      const action: BoardAction = {
        lessonId,
        pageIndex,
        type:      raw.type,
        data:      raw.data,
        userId:    user.id,
        timestamp: Date.now(),
      };
 
      const listLen = await saveStroke(action);
 
      // п.5: предупреждение при достижении порога (тьютору)
      // Полноценный snapshot-триггер — вторая волна (отдельный job)
      if (listLen >= MAX_ACTIONS_PER_PAGE && user.activeRole === "tutor") {
        socket.emit("board:snapshotRecommended", { lessonId, pageIndex, count: listLen });
      }
 
      io.to(`board:${lessonId}`).emit("board:action", action);
    }),
  );
 
  // ── board:clearPage ────────────────────────────────────────────────────────
  //
  // Только тьютор/админ. Удаляет List и убирает из Set-индекса (п.8).
  // Клиент: socket.emit("board:clearPage", { lessonId, pageIndex })
  //
  socket.on(
    "board:clearPage",
    safeHandler("board:clearPage", async (data: { lessonId: string; pageIndex: number }) => {
      if (user.activeRole !== "tutor" && user.activeRole !== "admin") return;
 
      const lessonId  = String(data?.lessonId ?? "").trim();
      const pageIndex = Number(data?.pageIndex);
 
      const ctx = socket.data.lessonCtx as { lessonId: string } | undefined;
      if (!ctx || ctx.lessonId !== lessonId) return;
      if (Number.isNaN(pageIndex) || pageIndex < 0 || pageIndex >= MAX_PAGES) return;
 
      // п.8: чистим и List, и Set-индекс
      await clearPage(lessonId, pageIndex);
      io.to(`board:${lessonId}`).emit("board:pageCleared", { lessonId, pageIndex });
    }),
  );
};