import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGetUserProfileQuery } from '@shared/api/profileApi';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { LessonCard } from '@widgets/lesson-card/index';
import { ProgressChart } from '@widgets/dashboard/ui/ProgressChart';
import { Spinner } from '@shared/index';
import { Link } from 'react-router-dom';
export const ClientDashboard = () => {
    const { data: profile, isLoading: profileLoading } = useGetUserProfileQuery();
    const { data: lessonsData, isLoading: lessonsLoading } = useGetUserLessonsQuery({
        status: 'confirmed',
    });
    const upcomingLessons = lessonsData?.lessons ?? [];
    if (profileLoading)
        return _jsx(Spinner, {});
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: ["Willkommen, ", profile?.name, "!"] }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Hier sind Ihre n\u00E4chsten Unterrichtsstunden." })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(QuickAction, { to: "/tutors", icon: "\uD83D\uDD0D", title: "Nachhilfelehrer finden", description: "Alle verf\u00FCgbaren Lehrer ansehen" }), _jsx(QuickAction, { to: "/lessons", icon: "\uD83D\uDCC5", title: "Alle Unterrichte", description: "Vergangene und geplante Stunden" }), _jsx(QuickAction, { to: "/settings", icon: "\u2699\uFE0F", title: "Einstellungen", description: "Profil und Konto verwalten" })] }), _jsx(ProgressChart, {}), _jsxs("section", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "N\u00E4chste Unterrichtsstunden" }), _jsx(Link, { to: "/lessons", className: "text-sm text-blue-600 hover:underline", children: "Alle ansehen" })] }), lessonsLoading ? (_jsx(Spinner, {})) : upcomingLessons.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center", children: [_jsx("p", { className: "text-gray-400 text-sm mb-4", children: "Keine Unterrichtsstunden geplant." }), _jsx(Link, { to: "/tutors", className: "bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: "Nachhilfelehrer suchen" })] })) : (_jsx("div", { className: "space-y-3", children: upcomingLessons.slice(0, 3).map((lesson) => (_jsx(LessonCard, { lesson: lesson, role: "client" }, lesson.id))) }))] })] }));
};
const QuickAction = ({ to, icon, title, description, }) => (_jsxs(Link, { to: to, className: "bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md\r\n      transition group flex items-start gap-4", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 group-hover:text-blue-600 transition text-sm", children: title }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: description })] })] }));
