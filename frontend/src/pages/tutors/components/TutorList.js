import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams, Link } from 'react-router-dom';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { Spinner } from '@shared/index';
export const TutorList = () => {
    const [params] = useSearchParams();
    const { data, isLoading, isError } = useGetTutorsQuery({
        search: params.get('search') ?? undefined,
        minRate: params.get('minRate') ? Number(params.get('minRate')) : undefined,
        maxRate: params.get('maxRate') ? Number(params.get('maxRate')) : undefined,
        page: Number(params.get('page') ?? 1),
        limit: 12,
    });
    if (isLoading)
        return _jsx(Spinner, {});
    if (isError)
        return (_jsx("div", { className: "text-center py-12 text-red-500 text-sm", children: "Fehler beim Laden. Bitte versuchen Sie es erneut." }));
    const tutors = data?.tutors ?? [];
    if (!tutors.length)
        return (_jsx("div", { className: "text-center py-12 text-gray-400 text-sm", children: "Keine Nachhilfelehrer gefunden." }));
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-gray-500", children: [data?.total ?? 0, " Lehrer gefunden"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: tutors.map((tutor) => (_jsxs(Link, { to: `/tutors/${tutor.id}`, className: "bg-white rounded-2xl border border-gray-100 p-5\r\n              hover:shadow-md transition group", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-blue-100 flex items-center\r\n                justify-center text-blue-600 font-bold text-lg flex-shrink-0", children: tutor.avatarUrl
                                        ? _jsx("img", { src: tutor.avatarUrl, alt: "", className: "w-12 h-12 rounded-full object-cover" })
                                        : `${tutor.name[0]}${tutor.surname[0]}` }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "font-semibold text-gray-900 group-hover:text-blue-600\r\n                  transition truncate", children: [tutor.name, " ", tutor.surname] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["\u2B50 ", tutor.ratingAvg.toFixed(1), " (", tutor.ratingCount, ")"] })] })] }), (tutor.highlightDe || tutor.highlightRu) && (_jsx("p", { className: "text-sm text-gray-600 line-clamp-2 mb-3", children: tutor.highlightDe ?? tutor.highlightRu })), _jsxs("div", { className: "flex items-center justify-between mt-auto", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: tutor.hourlyRate ? `${tutor.hourlyRate} €/Std.` : 'Preis auf Anfrage' }), _jsx("span", { className: "text-xs text-blue-600 font-medium", children: "Profil ansehen \u2192" })] })] }, tutor.id))) })] }));
};
