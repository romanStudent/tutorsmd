import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { Spinner } from '@shared/index';
export const TutorsPreview = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { data, isLoading } = useGetTutorsQuery({ limit: 3, page: 1 });
    const tutors = data?.tutors ?? [];
    const labels = {
        de: { title: 'Unsere Nachhilfelehrer', all: 'Alle Lehrer ansehen', reviews: 'Bewertungen' },
        ru: { title: 'Наши репетиторы', all: 'Смотреть всех', reviews: 'отзывов' },
        en: { title: 'Our tutors', all: 'View all tutors', reviews: 'reviews' },
    };
    const l = labels[lang] ?? labels.de;
    return (_jsxs("section", { className: "max-w-5xl mx-auto px-6 py-16", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: l.title }), _jsxs(Link, { to: "/tutors", className: "text-sm text-blue-600 hover:underline", children: [l.all, " \u2192"] })] }), isLoading ? (_jsx(Spinner, {})) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: tutors.map((tutor) => (_jsxs(Link, { to: `/tutors/${tutor.id}`, className: "bg-white rounded-2xl border border-gray-100 p-5\r\n                hover:shadow-md transition group", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-blue-100 flex items-center\r\n                justify-center text-blue-600 font-bold text-xl mb-4 flex-shrink-0", children: tutor.avatarUrl
                                ? _jsx("img", { src: tutor.avatarUrl, alt: "", className: "w-14 h-14 rounded-2xl object-cover" })
                                : `${tutor.name[0]}${tutor.surname[0]}` }), _jsx("p", { className: "font-semibold text-gray-900 group-hover:text-blue-600 transition", children: lang === 'de' && tutor.nameDe
                                ? `${tutor.nameDe} ${tutor.surnameDe}`
                                : lang === 'ru' && tutor.nameRu
                                    ? `${tutor.nameRu} ${tutor.surnameRu}`
                                    : `${tutor.name} ${tutor.surname}` }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: ["\u2B50 ", tutor.ratingAvg.toFixed(1), " (", tutor.ratingCount, " ", l.reviews, ")"] }), (tutor.highlightDe || tutor.highlightRu) && (_jsx("p", { className: "text-sm text-gray-600 mt-3 line-clamp-2", children: lang === 'ru' && tutor.highlightRu
                                ? tutor.highlightRu
                                : tutor.highlightDe })), tutor.hourlyRate && (_jsxs("p", { className: "text-sm font-semibold text-gray-900 mt-3", children: [tutor.hourlyRate, " \u20AC/Std."] }))] }, tutor.id))) }))] }));
};
