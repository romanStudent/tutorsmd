// presentation/websocket/handlers/lessonHandler.ts
//
// Ответственность:
//   joinLesson       — авторизация в комнате, Redis presence
//   joinLessonChat   — подписка на отдельную чат-комнату + история из Postgres
//   lessonMessage    — сохранение сообщения в Postgres, broadcast
//   leaveLesson      — явный выход, очистка presence
//   endLesson        — тьютор/админ завершает урок, опционально обновляет статус в БД
//   disconnect       — автоматическое удаление из presence
//
// Файлы в чате урока передаются НЕ через сокет.
// Клиент сначала POST /api/lessons/:id/files → получает presigned URL → грузит в R2
// → шлёт lessonMessage с fileKey. Сервер хранит только R2-ключ в LessonMessage.

import type { Server, Socket } from "socket.io";
import type { PrismaClient }   from "../../../../generated/prisma";
import { safeHandler }         from "../../utils/safeHandler";
import { isRateLimited }       from "../../middleware/socketRateLimit";
import {
  presenceAdd,
  presenceRemove,
  presenceClear,
} from "../../utils/redisPresence";

// ── Типы ──────────────────────────────────────────────────────────────────────

// Хранится в socket.data после успешного joinLesson.
// Поля берём из Lesson entity: clientId / tutorId — это userId (не email).
interface LessonContext {
  lessonId: string;
  clientId: string; // User.id клиента
  tutorId:  string; // User.id тьютора
  startAt:  Date;
  status:   string; // LessonStatus
}

// ── Resolve lesson context ────────────────────────────────────────────────────

const resolveLessonContext = async (
  prisma:   PrismaClient,
  lessonId: string,
): Promise<LessonContext | null> => {
  const lesson = await prisma.lesson.findUnique({
    where:  { id: lessonId },
    select: {
      id:          true,
      clientId:    true,
      tutorId:     true,
      scheduledAt: true,
      status:      true,
    },
  });

  if (!lesson) return null;

  return {
    lessonId: lesson.id,
    clientId: lesson.clientId,
    tutorId:  lesson.tutorId,
    startAt:  lesson.scheduledAt,
    status:   lesson.status,
  };
};

// ── Handler factory ───────────────────────────────────────────────────────────

export const createLessonHandler = (
  io:     Server,
  socket: Socket,
  prisma: PrismaClient,
): void => {
  const user = socket.data.user as { id: string; activeRole: string } | undefined;
  if (!user) return;

  // ── joinLesson ─────────────────────────────────────────────────────────────
  //
  // Клиент: socket.emit("joinLesson", { lessonId })
  // Сервер: проверяет права (clientId | tutorId | admin), кладёт в Socket.IO room,
  //         добавляет в Redis presence, рассылает updateParticipants.
  //
  socket.on(
    "joinLesson",
    safeHandler("joinLesson", async (data: { lessonId: string }) => {
      // Идемпотентность: уже в уроке → повторно шлём joinedLesson
      const existing = socket.data.lessonCtx as LessonContext | undefined;
      if (existing) {
        socket.emit("joinedLesson", {
          startAt: existing.startAt,
          status:  existing.status,
        });
        return;
      }

      const lessonId = String(data?.lessonId ?? "").trim();
      if (!lessonId) {
        socket.emit("joinLessonError", { code: "BAD_REQUEST", message: "lessonId required" });
        return;
      }

      const ctx = await resolveLessonContext(prisma, lessonId);
      if (!ctx) {
        socket.emit("joinLessonError", { code: "NOT_FOUND", message: "Lesson not found" });
        return;
      }

      const allowed =
        user.activeRole === "admin" ||
        user.id === ctx.clientId    ||
        user.id === ctx.tutorId;

      if (!allowed) {
        socket.emit("joinLessonError", { code: "FORBIDDEN", message: "Access denied" });
        return;
      }

      // Кешируем контекст на время соединения — не ходим в БД повторно
      socket.data.lessonCtx = ctx;
      socket.data.lessonId  = ctx.lessonId;

      await socket.join(ctx.lessonId);

      const participants = await presenceAdd(ctx.lessonId, socket.id);
      io.to(ctx.lessonId).emit("updateParticipants", participants);

      if (user.activeRole === "tutor") {
        io.to(ctx.lessonId).emit("tutorJoined", true);
      }

      socket.emit("joinedLesson", {
        startAt: ctx.startAt,
        status:  ctx.status,
      });
    }),
  );

  // ── joinLessonChat ─────────────────────────────────────────────────────────
  //
  // Отдельная Socket.IO room "lesson-chat:{lessonId}" — чтобы не смешивать
  // сигнальные события урока (WebRTC, presence) с сообщениями чата.
  //
  // Клиент: socket.emit("joinLessonChat", { lessonId })
  // Сервер: шлёт lessonChatHistory (последние 50 из Postgres)
  //
  socket.on(
    "joinLessonChat",
    safeHandler("joinLessonChat", async (data: { lessonId: string }) => {
      const ctx = socket.data.lessonCtx as LessonContext | undefined;
      const lessonId = String(data?.lessonId ?? "").trim();

      if (!ctx || ctx.lessonId !== lessonId) {
        socket.emit("joinLessonChatError", { code: "NOT_IN_LESSON" });
        return;
      }

      const chatRoom = `lesson-chat:${lessonId}`;
      if (socket.rooms.has(chatRoom)) return; // идемпотентно

      await socket.join(chatRoom);

      const history = await prisma.lessonMessage.findMany({
        where:   { lessonId },
        orderBy: { createdAt: "asc" },
        take:    50,
        select: {
          id:         true,
          senderId:   true,
          senderRole: true,
          text:       true,
          fileKey:    true, // R2 object key; клиент строит URL сам через CDN
          createdAt:  true,
        },
      });

      socket.emit("lessonChatHistory", history);
      socket.emit("joinedLessonChat", { success: true });

      io.to(chatRoom).emit("userJoinedLessonChat", {
        userId: user.id,
        role:   user.activeRole,
      });
    }),
  );

  // ── lessonMessage ──────────────────────────────────────────────────────────
  //
  // Клиент: socket.emit("lessonMessage", { lessonId, text, fileKey? })
  //   fileKey — опционально, R2 object key файла, уже загруженного клиентом.
  //   Файл в байтах через сокет НЕ передаётся.
  //
  socket.on(
    "lessonMessage",
    safeHandler("lessonMessage", async (data: {
      lessonId: string;
      text:     string;
      fileKey?: string;
    }) => {
      // 60 сообщений / 60 секунд
      if (await isRateLimited(socket, 60, "lessonMessage", 60_000)) return;

      const ctx = socket.data.lessonCtx as LessonContext | undefined;
      const lessonId = String(data?.lessonId ?? "").trim();

      if (!ctx || ctx.lessonId !== lessonId) return;

      const text    = String(data?.text ?? "").trim();
      const fileKey = data?.fileKey ? String(data.fileKey).trim() : null;

      // Не принимаем полностью пустые сообщения
      if (!text && !fileKey) return;

      const message = await prisma.lessonMessage.create({
        data: {
          lessonId,
          senderId:   user.id,
          senderRole: user.activeRole,
          text:       text   || null,
          fileKey:    fileKey || null,
        },
        select: {
          id:         true,
          senderId:   true,
          senderRole: true,
          text:       true,
          fileKey:    true,
          createdAt:  true,
        },
      });

      io.to(`lesson-chat:${lessonId}`).emit("newLessonMessage", message);
    }),
  );

  // ── leaveLesson ────────────────────────────────────────────────────────────
  //
  // Явный выход (кнопка «Покинуть»).
  // disconnect обрабатывает внезапный разрыв соединения.
  //
  socket.on(
    "leaveLesson",
    safeHandler("leaveLesson", async (data: { lessonId: string }) => {
      const lessonId = String(data?.lessonId ?? "").trim();
      if (!lessonId) return;

      await socket.leave(lessonId);
      await socket.leave(`lesson-chat:${lessonId}`);

      const participants = await presenceRemove(lessonId, socket.id);
      io.to(lessonId).emit("updateParticipants", participants);

      // Сброс контекста — disconnect не будет дублировать событие
      delete socket.data.lessonCtx;
      delete socket.data.lessonId;
    }),
  );

  // ── endLesson ──────────────────────────────────────────────────────────────
  //
  // Только тьютор или админ.
  // Очищаем Redis presence и шлём meetingEnded всем в комнате.
  // Клиенты после получения meetingEnded сами закрывают соединение.
  //
  socket.on(
    "endLesson",
    safeHandler("endLesson", async (data: { lessonId: string }) => {
      if (user.activeRole !== "tutor" && user.activeRole !== "admin") return;

      const lessonId = String(data?.lessonId ?? "").trim();
      if (!lessonId) return;

      // Дополнительная проверка: только участник урока может его завершить
      const ctx = socket.data.lessonCtx as LessonContext | undefined;
      if (!ctx || ctx.lessonId !== lessonId) return;

      await presenceClear(lessonId);

      // Обновляем статус урока в БД (in_progress → completed)
      // Используем updateMany чтобы не падать если статус уже другой
      await prisma.lesson.updateMany({
        where: { id: lessonId, status: "in_progress" },
        data:  { status: "completed", completedAt: new Date(), updatedAt: new Date() },
      }).catch((err: unknown) =>
        console.error("[endLesson] db update failed:", err)
      );

      io.to(lessonId).emit("meetingEnded");
    }),
  );

  // ── disconnect ─────────────────────────────────────────────────────────────
  //
  // Срабатывает при любом разрыве (закрытие вкладки, сеть упала и т.д.).
  // lessonCtx уже сброшен при явном leaveLesson — не дублируем.
  //
  socket.on("disconnect", () => {
    const lessonId = socket.data?.lessonId as string | undefined;
    if (!lessonId) return;

    presenceRemove(lessonId, socket.id)
      .then((participants) => {
        io.to(lessonId).emit("updateParticipants", participants);
      })
      .catch((err: unknown) =>
        console.error("[disconnect] presenceRemove failed:", err)
      );
  });
};