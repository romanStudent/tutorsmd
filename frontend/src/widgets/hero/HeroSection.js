import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
import { useTranslation } from 'react-i18next';
export const HeroSection = () => {
    const { i18n } = useTranslation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const lang = i18n.language;
    const content = {
        de: {
            title: 'Finden Sie Ihren idealen Nachhilfelehrer',
            subtitle: 'Online-Unterricht in Mathematik und Deutsch — flexibel, effektiv, persönlich.',
            cta: 'Lehrer finden',
            login: 'Anmelden',
            badge: 'Probestunde verfügbar',
        },
        ru: {
            title: 'Найдите своего идеального репетитора',
            subtitle: 'Онлайн-уроки по математике и немецкому — гибко, эффективно, персонально.',
            cta: 'Найти учителя',
            login: 'Войти',
            badge: 'Пробный урок доступен',
        },
        en: {
            title: 'Find your ideal tutor',
            subtitle: 'Online lessons in Math and German — flexible, effective, personal.',
            cta: 'Find a tutor',
            login: 'Sign in',
            badge: 'Trial lesson available',
        },
    };
    const t = content[lang] ?? content.de;
    return (_jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white", children: [_jsx("div", { className: "absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" }), _jsx("div", { className: "absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" }), _jsx("div", { className: "max-w-5xl mx-auto px-6 py-24 relative z-10", children: _jsxs("div", { className: "max-w-2xl", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm\r\n            text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6", children: ["\u2728 ", t.badge] }), _jsx("h1", { className: "text-4xl sm:text-5xl font-bold leading-tight mb-4", children: t.title }), _jsx("p", { className: "text-lg text-blue-100 mb-8 leading-relaxed", children: t.subtitle }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(Link, { to: "/tutors", className: "bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl\r\n                hover:bg-blue-50 transition text-sm", children: t.cta }), !isAuthenticated && (_jsx(Link, { to: "/login", className: "border border-white/40 text-white font-medium px-6 py-3\r\n                  rounded-xl hover:bg-white/10 transition text-sm", children: t.login }))] }), _jsx("div", { className: "flex flex-wrap gap-8 mt-12", children: [
                                { value: '2+', label: lang === 'ru' ? 'года опыта' : 'Jahre Erfahrung' },
                                { value: '100%', label: lang === 'ru' ? 'онлайн' : 'Online' },
                                { value: '75', label: lang === 'ru' ? 'мин / урок' : 'Min / Stunde' },
                            ].map((s) => (_jsxs("div", { children: [_jsx("p", { className: "text-3xl font-bold", children: s.value }), _jsx("p", { className: "text-blue-200 text-sm", children: s.label })] }, s.label))) })] }) })] }));
};
