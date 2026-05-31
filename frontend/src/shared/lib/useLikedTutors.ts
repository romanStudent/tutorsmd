import { useState, useCallback } from 'react';

const STORAGE_KEY = 'likedTutors';

const readIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const writeIds = (ids: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

// ─── Stateless helpers (для LikeButton без хука) ─────────────
export const isLiked   = (tutorId: string): boolean => readIds().includes(tutorId);

export const toggleLike = (tutorId: string): string[] => {
  const ids  = readIds();
  const next = ids.includes(tutorId)
    ? ids.filter(id => id !== tutorId)
    : [...ids, tutorId];
  writeIds(next);
  return next;
};

// ─── Hook — для LikedTutorsPage ──────────────────────────────
export const useLikedTutors = () => {
  const [likedIds, setLikedIds] = useState<string[]>(readIds);

  const remove = useCallback((tutorId: string) => {
    const next = likedIds.filter(id => id !== tutorId);
    writeIds(next);
    setLikedIds(next);
  }, [likedIds]);

  const toggle = useCallback((tutorId: string): boolean => {
    const next = toggleLike(tutorId);
    setLikedIds(next);
    return next.includes(tutorId);
  }, []);

  return { likedIds, remove, toggle };
};