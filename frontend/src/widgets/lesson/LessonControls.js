import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { useConfirmLessonMutation, useCancelByClientMutation, useCancelByTutorMutation, } from '@shared/api/lessonApi';
export const LessonControls = ({ lessonId, lesson, localStream }) => {
    const navigate = useNavigate();
    const activeRole = useSelector(selectActiveRole);
    const [mic, setMic] = useState(true);
    const [cam, setCam] = useState(true);
    const [confirmLesson] = useConfirmLessonMutation();
    const [cancelByClient] = useCancelByClientMutation();
    const [cancelByTutor] = useCancelByTutorMutation();
    const toggleMic = () => {
        localStream?.getAudioTracks().forEach(t => { t.enabled = !mic; });
        setMic(v => !v);
    };
    const toggleCam = () => {
        localStream?.getVideoTracks().forEach(t => { t.enabled = !cam; });
        setCam(v => !v);
    };
    const handleLeave = async () => {
        localStream?.getTracks().forEach(t => t.stop());
        navigate('/dashboard');
    };
    const handleCancel = async () => {
        if (!confirm('Unterricht wirklich absagen?'))
            return;
        if (activeRole === 'client') {
            await cancelByClient({ lessonId }).unwrap().catch(() => { });
        }
        else {
            await cancelByTutor({ lessonId }).unwrap().catch(() => { });
        }
        navigate('/dashboard');
    };
    return (_jsxs("div", { className: "bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-center gap-4", children: [_jsx("button", { onClick: toggleMic, className: `p-3 rounded-xl transition ${mic ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`, title: mic ? 'Mikrofon ausschalten' : 'Mikrofon einschalten', children: mic ? '🎤' : '🔇' }), _jsx("button", { onClick: toggleCam, className: `p-3 rounded-xl transition ${cam ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`, title: cam ? 'Kamera ausschalten' : 'Kamera einschalten', children: cam ? '📷' : '🚫' }), activeRole === 'tutor' && lesson.status === 'pending' && (_jsx("button", { onClick: () => confirmLesson(lessonId), className: "bg-green-600 hover:bg-green-700 text-white text-sm font-medium\r\n            px-4 py-2 rounded-xl transition", children: "Best\u00E4tigen" })), ['pending', 'confirmed'].includes(lesson.status) && (_jsx("button", { onClick: handleCancel, className: "bg-gray-700 hover:bg-red-700 text-white text-sm font-medium\r\n            px-4 py-2 rounded-xl transition", children: "Absagen" })), _jsx("button", { onClick: handleLeave, className: "bg-red-600 hover:bg-red-700 text-white text-sm font-medium\r\n          px-4 py-2 rounded-xl transition", children: "Verlassen" })] }));
};
