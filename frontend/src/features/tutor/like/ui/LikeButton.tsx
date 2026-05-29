// Кнопка "В избранное" — используется на TutorPage и TutorList карточке

import { useState, useEffect } from 'react';
import { toggleLike, isLiked } from '@pages/liked-tutors/LikedTutorsPage';

interface Props {
  tutorId: string;
  className?: string;
}

export const LikeButton = ({ tutorId, className }: Props) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isLiked(tutorId));
  }, [tutorId]);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault(); // не переходить по Link если кнопка внутри него
    const next = toggleLike(tutorId);
    setLiked(next.includes(tutorId));
  };

  return (
    <button
      onClick={handle}
      className={`text-2xl transition ${liked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'} ${className ?? ''}`}
      title={liked ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
};
