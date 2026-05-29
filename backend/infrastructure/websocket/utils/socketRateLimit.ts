import { Socket } from "socket.io";
import redis from "../../redis/redisClient";

// ── Redis fixed-window per-user event rate limiter ────────────────────────────
//
// Работает корректно в кластере (pm2 / k8s): счётчик общий для всех процессов.
//
// Алгоритм: INCR + EXPIRE (fixed window).
// Для большинства задач TutorsMD этого достаточно.
// Если нужен точный sliding window — заменить на Sorted Set (ZADD/ZREMRANGEBYSCORE).

const RATE_LIMIT_KEY_PREFIX = "rl:event:";

/**
 * Проверяет, не превысил ли пользователь лимит событий за окно `windowSec`.
 *
 * @param socket    - сокет с аутентифицированным пользователем
 * @param limit     - максимальное число событий за окно
 * @param windowSec - размер окна в секундах (Redis TTL принимает секунды)
 *
 * @returns `true`  — лимит превышен, событие нужно отклонить.
 * @returns `false` — всё в порядке, событие можно обработать.
 *
 * @example
 * // 30 сообщений в минуту
 * if (await isRateLimited(socket, 30, 60)) {
 *   return callback({ error: "Too many requests" });
 * }
 *
 * @example
 * // Рисование на доске: высокий лимит, короткое окно — тихо дропаем
 * if (await isRateLimited(socket, 200, 10)) {
 *   return;
 * }
 */
export const isRateLimited = async (
  socket: Socket,
  limit: number,
  eventName: string,
  windowMs: number,
): Promise<boolean> => {

  const userId = socket.data.user.id as string;
  if (!userId) return false;

   const key = `${RATE_LIMIT_KEY_PREFIX}${userId}:${eventName}`;

  try {
    // INCR атомарен — безопасно при параллельных событиях от одного юзера
    const count = await redis.incr(key);

    // EXPIRE ставим только при первом инкременте — не сбрасываем окно каждый раз
    if (count === 1) {
      await redis.pExpire(key, windowMs);
    }

    return count > limit;
  } catch (err) {
    // Redis недоступен -> fail-open: пропускаем событие, не блокируем юзера
    // Логируем - но не роняем соединение
    console.error("[socketRateLimit] Redis недоступен, пропускаем проверку:", err);
    return false;
  }
};