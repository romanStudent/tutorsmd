import { useState, useEffect } from 'react';
import { isLiked, toggleLike } from '@shared/lib/useLikedTutors';
import { useTranslation } from 'react-i18next';

interface Props {
  tutorId:   string;
  className?: string;
  onRemove?: () => void; // колбэк для LikedTutorsPage — убрать из списка после анлайка
}

export const LikeButton = ({ tutorId, className, onRemove }: Props) => {
  const { t } = useTranslation('likedTutors');
  const [liked, setLiked] = useState(() => isLiked(tutorId));

  useEffect(() => {
    setLiked(isLiked(tutorId));
  }, [tutorId]);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleLike(tutorId);
    const nowLiked = next.includes(tutorId);
    setLiked(nowLiked);

    // Если был лайкнут и теперь снят — сообщаем родителю
    if (!nowLiked) onRemove?.();
  };

  return (
    <button
      onClick={handle}
      aria-label={liked ? t('remove') : t('add')}
      title={liked ? t('remove') : t('add')}
      className={`text-2xl leading-none transition-colors
        ${liked
          ? 'text-red-500 hover:text-red-400'
          : 'text-slate-300 hover:text-red-400'}
        ${className ?? ''}`}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
};