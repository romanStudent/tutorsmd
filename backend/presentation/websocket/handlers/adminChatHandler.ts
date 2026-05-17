// presentation/websocket/handlers/adminChatHandler.ts

import { Server, Socket } from "socket.io";
import { safeHandler } from "../utils/safeHandler";
import { isRateLimited } from "../middleware/socketRateLimit";
import { WireFileIn } from "../../../application/ports/file/IFileStorageService";
import { encrypt } from "../../../infrastructure/security/Aes256GcmDataEncrypt";
import { SendSupportMessageUseCase } from "../../../application/usecases/support-chat/SendSupportMessageUseCase";
import { GetSupportChatHistoryUseCase } from "../../../application/usecases/support-chat/GetSupportChatHistoryUseCase";

// ── Wire-тип входящего сообщения ──────────────────────────────────────────────
interface IncomingMessage {
  question?: string;
  answer?: string;
  language?: string;
  files?: WireFileIn[];
}

// ── Тип пользователя из socket.data ──────────────────────────────────────────
interface SocketUser {
  id: string;
  email: string;
  activeRole: string;
}

// ── Handler factory ───────────────────────────────────────────────────────────
export const createAdminChatHandler = (
  io: Server,
  socket: Socket,
  sendMessage: SendSupportMessageUseCase,
  getHistory: GetSupportChatHistoryUseCase
) => {
  // ── join ──────────────────────────────────────────────────────────────────
  // Клиент/тьютор/админ заходит в свою комнату поддержки
  socket.on(
    "join",
    safeHandler("join", async (_data: unknown, callback?: Function) => {
      const user = socket.data.user as SocketUser | undefined;
      if (!user) return socket.disconnect();

      // Комната = encrypt(email): уникальна для каждого пользователя
      // Админ при желании может зайти в комнату конкретного пользователя
      // через отдельное событие adminJoinChat (ниже)
      const chatId = `support:${user.id}`;
      socket.data.chatId = chatId;
      await socket.join(chatId);

      // История последних 50 сообщений
      const { messages } = await getHistory.execute({
        chatId,
        requesterId: user.id,
        requesterRole: user.activeRole,
        requesterChatId: chatId,
      });

      socket.emit("chatHistory", messages);
      io.to(chatId).emit("joined", { userId: user.id, role: user.activeRole });

      callback?.({ success: true });
    })
  );

  // ── adminJoinChat ─────────────────────────────────────────────────────────
  // Только для администратора: войти в чат конкретного пользователя
  socket.on(
    "adminJoinChat",
    safeHandler("adminJoinChat", async (
      data: { targetChatId: string },
      callback?: Function
    ) => {
      const user = socket.data.user as SocketUser | undefined;
      if (!user || user.activeRole !== "admin") {
        return callback?.({ error: "Forbidden" });
      }

      const { targetChatId } = data ?? {};
      if (!targetChatId?.trim()) {
        return callback?.({ error: "targetChatId is required" });
      }

      // Уходим из своей комнаты, заходим в комнату пользователя
      if (socket.data.chatId) {
        socket.leave(socket.data.chatId);
      }

      socket.data.chatId = targetChatId;
      await socket.join(targetChatId);

      const { messages } = await getHistory.execute({
        chatId: targetChatId,
        requesterId: user.id,
        requesterRole: user.activeRole,
        requesterChatId: socket.data.chatId,
      });

      socket.emit("chatHistory", messages);
      callback?.({ success: true });
    })
  );

  // ── message ───────────────────────────────────────────────────────────────
  socket.on(
    "message",
    safeHandler("message", async (
      data: { msg: IncomingMessage },
      callback?: Function
    ) => {
      // Rate limit: 30 сообщений в минуту
      if (await isRateLimited(socket, 30, 60_000) == true) {
        return callback?.({ error: "Too many messages" });
      }

      const user = socket.data.user as SocketUser | undefined;
      if (!user) return callback?.({ error: "Unauthorized" });

      const chatId = socket.data.chatId as string | undefined;
      if (!chatId) return callback?.({ error: "Join chat first" });

      const { msg } = data ?? {};
      if (!msg) return callback?.({ error: "Empty payload" });

      const { message } = await sendMessage.execute({
        chatId,
        senderId: user.id,
        senderRole: user.activeRole,
        question: msg.question,
        answer: msg.answer,
        language: msg.language,
        files: msg.files,
      });

      // Payload для фронта — полный DTO из БД
      io.to(chatId).emit("message", message);
      callback?.({ success: true, messageId: message.id });
    })
  );

  // ── typing ────────────────────────────────────────────────────────────────
  // Индикатор "пишет..." — не сохраняем в БД, только транслируем
  socket.on(
    "typing",
    safeHandler("typing", async (data: { isTyping: boolean }) => {
      const user = socket.data.user as SocketUser | undefined;
      const chatId = socket.data.chatId as string | undefined;
      if (!user || !chatId) return;

      // Отправляем всем в комнате кроме себя
      socket.to(chatId).emit("typing", {
        userId: user.id,
        role: user.activeRole,
        isTyping: data?.isTyping ?? false,
      });
    })
  );
};