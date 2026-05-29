// presentation/websocket/utils/redisPresence.ts
//
// Presence через Redis Sets.
// Ключ: presence:{lessonId} → Set<socketId>
// TTL = 4 h (перекрывает максимальную длину урока).
// При масштабировании до нескольких нод работает из коробки.

import redis from "../../redis/redisClient";

const TTL_SECONDS = 60 * 60 * 4;
const key = (lessonId: string) => `presence:${lessonId}`;

export const presenceAdd = async (
  lessonId: string,
  socketId: string,
): Promise<string[]> => {
  const k = key(lessonId);
  await redis.sAdd(k, socketId);
  await redis.expire(k, TTL_SECONDS);
  return redis.sMembers(k);
};

export const presenceRemove = async (
  lessonId: string,
  socketId: string,
): Promise<string[]> => {
  const k = key(lessonId);
  await redis.sRem(k, socketId);
  const members = await redis.sMembers(k);
  if (members.length === 0) await redis.del(k);
  return members;
};

// Вызывается при endLesson — явная очистка комнаты
export const presenceClear = async (lessonId: string): Promise<void> => {
  await redis.del(key(lessonId));
};