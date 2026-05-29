import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { Layout } from '@widgets/layout/ui/Layout';
import { LessonCard } from '@widgets/lesson-card/ui/LessonCard';
import { Spinner } from '@shared/index';
const STATUS_TABS = [
    { label: 'Alle', statuses: undefined },
    { label: 'Anfragen', statuses: ['pending'] },
    { label: 'Bestätigt', statuses: ['confirmed'] },
    { label: 'Abgeschlossen', statuses: ['completed'] },
    { label: 'Storniert', statuses: ['cancelled_by_client', 'cancelled_by_tutor'] },
];
export default function LessonsPage() {
    const role = useSelector(selectActiveRole);
    const [activeTab, setActiveTab] = useState(0);
    const tab = STATUS_TABS[activeTab];
    // RTK Query — передаём первый статус если задан (бэкенд фильтрует)
    const { data, isLoading } = useGetUserLessonsQuery(tab.statuses ? { status: tab.statuses[0] } : {});
    // Клиентская фильтрация для множественных статусов
    const lessons = data?.lessons.filter((l) => tab.statuses ? tab.statuses.includes(l.status) : true) ?? [];
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Meine Unterrichtsstunden" }), _jsx("div", { className: "flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto", children: STATUS_TABS.map((tab, i) => (_jsx("button", { onClick: () => setActiveTab(i), className: `px-4 py-2 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px
                ${activeTab === i
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: tab.label }, i))) }), isLoading ? (_jsx(Spinner, {})) : lessons.length === 0 ? (_jsx(EmptyState, { role: role })) : (_jsx("div", { className: "space-y-3", children: lessons.map((lesson) => (_jsx(LessonCard, { lesson: lesson, role: role ?? 'client' }, lesson.id))) }))] }) }));
}
const EmptyState = ({ role }) => (_jsxs("div", { className: "bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83D\uDCC5" }), _jsx("p", { className: "text-gray-500 text-sm", children: role === 'tutor'
                ? 'Keine Unterrichtsstunden gefunden.'
                : 'Sie haben noch keine Unterrichtsstunden.' })] }));
