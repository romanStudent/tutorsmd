// presentation/websocket/handlers/boardHandler.ts
//
// Ответственность:
//   board:join    — подписка на board-комнату + hydration полного состояния из Redis
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
import {
  parseIncomingAction,
  type ValidatedBoardAction,
  type BoardActionType,
} from "./validate/board.schema";
 
// ── Константы ─────────────────────────────────────────────────────────────────
 
const BOARD_TTL_SECONDS  = 60 * 60 * 3; // 3 h — TTL для keys страниц
const MAX_PAGES          = 20;           // п.4: лимит страниц на урок
const MAX_ACTION_DATA_LEN = 10_000;      // п.3: 10 KB на payload одного action
const MAX_ACTIONS_PER_PAGE = 5_000;      // п.5: порог для будущего snapshot-триггера
 

const VALID_ACTION_TYPES = new Set<BoardActionType>([
  "brush", "line", "rect", "circle", "text", "erase", "image",
]);
 
export interface BoardAction {
  lessonId:  string;
  pageIndex: number;
  type:      BoardActionType;
  data:      ValidatedBoardAction["data"],
  userId:    string;  // проставляет сервер
  timestamp: number;  // проставляет сервер
}

interface LessonCtx {
  lessonId: string;
  status:   string; // LessonStatus
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
 
// очистка всех данных доски после (endLesson + snapshot)
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
// Вызывается из joinBoard и (в будущем) из snapshot job
export const loadBoardFromRedis = async (
  lessonId: string,
): Promise<Record<number, BoardAction[]>> => {
  
  // Set-индекс вместо redis.keys() — не блокирует Redis при большом числе ключей
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
    "board:join",
    safeHandler("board:join", async (data: { lessonId: string }) => {
      const lessonId = String(data?.lessonId ?? "").trim();
      if (!lessonId || lessonId.length == 0) return;
 
      const ctx = socket.data.lessonCtx as LessonCtx | undefined;
 
      // п.1: проверяем и принадлежность, и статус урока
      if (!ctx || ctx.lessonId !== lessonId) {
        socket.emit("board:error", { code: "NOT_IN_LESSON" });
        return;
      }
 
      if (!["confirmed", "in_progress"].includes(ctx.status)) {
        socket.emit("board:error", { code: "LESSON_NOT_ACTIVE" });
        return;
      }

      // Идемпотентность: уже в board-комнате → просто шлём fullState снова
      // (клиент мог переподключиться и запросить повторно)
      const boardRoom = `board:${lessonId}`;
      const alreadyIn = socket.rooms.has(boardRoom);

      if(!alreadyIn) {
        await socket.join(boardRoom);
      }


      // загружаю через Set-индекс, без redis.keys()
      const fullState = await loadBoardFromRedis(lessonId);
 
      socket.emit("board:fullState", fullState);
    }),
  );






 
  // -- board:action -----------------------------------------------------------------------------
  //
  // Клиент: socket.emit("board:action", { lessonId, pageIndex, type, data })
  // Сервер: валидирует, проставляет userId/timestamp, сохраняет в Redis, broadcast
  // Порядок проверок:
  //   1. Rate limit (200 / 10 сек)
  //   2. Zod: базовая структура (lessonId UUID, pageIndex int)
  //   3. Zod: discriminatedUnion — type + data вместе
  //   4. Авторизация: ctx.lessonId совпадает
  //   5. pageIndex < MAX_PAGES
  //   6. Сохранение + broadcast
  //
socket.on(
    "board:action",
    safeHandler("board:action", async (raw: unknown) => {
      // 1. Rate limit: 200 actions / 10 сек
      if (await isRateLimited(socket, 200, "board:action", 10_000)) return;
 
      // 2. Zod: полная валидация — структура + discriminatedUnion по type
      // После этой проверки lessonId, pageIndex, action строго типизированы
      const parsed = parseIncomingAction(raw);
      if (!parsed.success) {
        socket.emit("board:error", { code: "INVALID_ACTION", reason: parsed.error });
        return;
      }
 
      const { lessonId, pageIndex, action } = parsed;
 
      // 3. Авторизация
      const ctx = socket.data.lessonCtx as LessonCtx | undefined;
      if (!ctx || ctx.lessonId !== lessonId) return;
 
      // 4. Статус
      if (!["confirmed", "in_progress"].includes(ctx.status)) return;
 
      // 5. Лимит страниц
      if (pageIndex >= MAX_PAGES) {
        socket.emit("board:error", { code: "PAGE_LIMIT_EXCEEDED", max: MAX_PAGES });
        return;
      }
 
      // 6. Сохранение — userId и timestamp проставляет сервер, не клиент
      const boardAction: BoardAction = {
        lessonId,
        pageIndex,
        type:      action.type,
        data:      action.data,
        userId:    user.id,
        timestamp: Date.now(),
      };
 
      const listLen = await saveStroke(boardAction);
 
      if (listLen >= MAX_ACTIONS_PER_PAGE && user.activeRole === "tutor") {
        socket.emit("board:snapshotRecommended", { lessonId, pageIndex, count: listLen });
      }
 
      io.to(`board:${lessonId}`).emit("board:action", boardAction);
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

  socket.on(
    "board:undo",
      safeHandler("board:undo", async (data: { lessonId: string; pageIndex: number }) => {
        const lessonId  = String(data?.lessonId ?? "").trim();
        const pageIndex = Number(data?.pageIndex ?? 0);

        const ctx = socket.data.lessonCtx as LessonCtx | undefined;
        if (!ctx || ctx.lessonId !== lessonId) return;
        if (!["confirmed", "in_progress"].includes(ctx.status)) return;
        if (pageIndex < 0 || pageIndex >= MAX_PAGES) return;

        const k = pageKey(lessonId, pageIndex);

        // Удаляем последний action из Redis List
        const removed = await redis.rPop(k);
        if (!removed) return; // история пуста — нечего отменять

        // Загружаем оставшуюся историю
        const raw = await redis.lRange(k, 0, -1);
        const pageActions = raw.map(x => JSON.parse(x) as BoardAction);

        // Broadcast всем в комнате — все перерисовывают страницу
        io.to(`board:${lessonId}`).emit("board:pageState", {
          lessonId,
          pageIndex,
          actions: pageActions,
        });
      }),
  );

// board:redo не нужен как отдельный обработчик —
// клиент шлёт действие из redoStack как обычный board:action.
// Сервер сохраняет в Redis и broadcast — как любой другой action.
};