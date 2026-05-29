import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Бывший LessonLive
import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetLessonQuery } from '@shared/api/lessonApi';
import { Spinner } from '@shared/index';
import { VideoRoom } from '@widgets/lesson/VideoRoom';
import { LessonChat } from '@widgets/lesson/LessonChat';
import { Whiteboard } from '@widgets/lesson/Whiteboard';
import { LessonControls } from '@widgets/lesson/LessonControls';
export default function LessonPage() {
    const { lessonId } = useParams();
    const { data: lesson, isLoading } = useGetLessonQuery(lessonId ?? '', { skip: !lessonId });
    // VideoRoom props
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());
    // Sidebar tab
    const [activeTab, setActiveTab] = useState('chat');
    if (!lessonId)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    if (isLoading)
        return _jsx(Spinner, { fullscreen: true });
    if (!lesson)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    const canJoin = lesson.status === 'confirmed' || lesson.status === 'in_progress';
    return (_jsxs("div", { className: "h-screen flex flex-col bg-gray-900 text-white overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-gray-800\r\n        border-b border-gray-700 flex-shrink-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${lesson.status === 'in_progress'
                                    ? 'bg-green-400 animate-pulse'
                                    : 'bg-yellow-400'}` }), _jsx("span", { className: "text-sm font-medium", children: lesson.status === 'in_progress' ? 'Unterricht läuft' : 'Warteraum' })] }), _jsxs("span", { className: "text-xs text-gray-400", children: [new Date(lesson.scheduledAt).toLocaleString('de-DE'), ' · ', lesson.durationMinutes, " Min."] })] }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(VideoRoom, { lessonId: lessonId, localStream: localStream, setLocalStream: setLocalStream, remoteStreams: remoteStreams, setRemoteStreams: setRemoteStreams, canJoin: canJoin }), _jsx(LessonControls, { lessonId: lessonId, lesson: lesson, localStream: localStream })] }), _jsxs("aside", { className: "w-80 flex flex-col border-l border-gray-700\r\n          bg-gray-800 flex-shrink-0", children: [_jsx("div", { className: "flex border-b border-gray-700 flex-shrink-0", children: ['chat', 'whiteboard'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `flex-1 py-2 text-sm font-medium transition
                  ${activeTab === tab
                                        ? 'text-white border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-gray-200'}`, children: tab === 'chat' ? '💬 Chat' : '🖊 Whiteboard' }, tab))) }), _jsx("div", { className: "flex-1 overflow-hidden", children: activeTab === 'chat'
                                    ? _jsx(LessonChat, { lessonId: lessonId })
                                    : _jsx(Whiteboard, { lessonId: lessonId }) })] })] })] }));
}
