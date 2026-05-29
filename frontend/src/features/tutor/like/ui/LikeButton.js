import { jsx as _jsx } from "react/jsx-runtime";
// Кнопка "В избранное" — используется на TutorPage и TutorList карточке
import { useState, useEffect } from 'react';
import { toggleLike, isLiked } from '@pages/liked-tutors/LikedTutorsPage';
export const LikeButton = ({ tutorId, className }) => {
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        setLiked(isLiked(tutorId));
    }, [tutorId]);
    const handle = (e) => {
        e.preventDefault(); // не переходить по Link если кнопка внутри него
        const next = toggleLike(tutorId);
        setLiked(next.includes(tutorId));
    };
    return (_jsx("button", { onClick: handle, className: `text-2xl transition ${liked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'} ${className ?? ''}`, title: liked ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen', children: liked ? '♥' : '♡' }));
};
