import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useGetTutorByIdQuery, useGetTutorSlotsQuery } from '@shared/api/tutor/tutorPublicApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { Layout } from '@widgets/layout/ui/Layout';
import { Spinner } from '@shared/index';
import { BookTrialButton } from './components/BookTrialButton';
import { TutorSchedule } from './components/TutorSchedule';
export default function TutorPage() {
    const { tutorId } = useParams();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const activeRole = useSelector(selectActiveRole);
    const { data: tutor, isLoading } = useGetTutorByIdQuery(tutorId ?? '', { skip: !tutorId });
    const { data: slotsData } = useGetTutorSlotsQuery(tutorId ?? '', { skip: !tutorId });
    if (isLoading)
        return _jsx(Layout, { children: _jsx(Spinner, {}) });
    if (!tutor)
        return _jsx(Layout, { children: _jsx("div", { className: "text-center py-12 text-gray-400", children: "Nicht gefunden." }) });
    const slots = slotsData?.slots ?? [];
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8 space-y-8", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6", children: [_jsx("div", { className: "w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center\r\n            text-blue-600 font-bold text-3xl flex-shrink-0", children: tutor.avatarUrl
                                ? _jsx("img", { src: tutor.avatarUrl, alt: "", className: "w-24 h-24 rounded-2xl object-cover" })
                                : `${tutor.name[0]}${tutor.surname[0]}` }), _jsxs("div", { className: "flex-1", children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: [tutor.name, " ", tutor.surname] }), tutor.nameDe && (_jsxs("p", { className: "text-sm text-gray-400", children: [tutor.nameDe, " ", tutor.surnameDe] })), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["\u2B50 ", tutor.ratingAvg.toFixed(1), " (", tutor.ratingCount, " Bewertungen)"] }), tutor.hourlyRate && (_jsxs("span", { className: "text-sm font-semibold text-gray-900", children: [tutor.hourlyRate, " \u20AC/Std."] }))] }), tutor.highlightDe && (_jsx("p", { className: "text-sm text-gray-600 mt-3", children: tutor.highlightDe }))] })] }), tutor.fulldescribeDe && (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [_jsx("h2", { className: "font-semibold text-gray-900 mb-3", children: "\u00DCber mich" }), _jsx("p", { className: "text-sm text-gray-600 whitespace-pre-line", children: tutor.fulldescribeDe })] })), _jsx(TutorSchedule, { slots: slots }), _jsxs("div", { className: "bg-blue-600 rounded-2xl p-6 text-white text-center", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "Probestunde buchen" }), _jsx("p", { className: "text-blue-100 text-sm mb-4", children: "Erste Stunde \u2014 lernen Sie den Lehrer kennen." }), isAuthenticated && activeRole === 'client' ? (_jsx(BookTrialButton, { tutorId: tutor.id })) : !isAuthenticated ? (_jsx(Link, { to: "/login", className: "inline-block bg-white text-blue-600 font-medium text-sm\r\n                px-6 py-2 rounded-lg hover:bg-blue-50 transition", children: "Anmelden zum Buchen" })) : (_jsx("p", { className: "text-blue-200 text-sm", children: "Nur Sch\u00FCler k\u00F6nnen Unterricht buchen." }))] })] }) }));
}
