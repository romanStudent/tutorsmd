import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@shared/ui/LanguageSwitcher/LanguageSwitcher';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@entities/user/model/selectors';
export const Footer = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const t = {
        de: {
            lang: 'Sprache',
            menu: 'Menü',
            company: 'Unternehmen',
            help: 'Hilfe',
            about: 'Über uns',
            privacy: 'Datenschutz',
            faq: 'FAQ',
            support: 'Support',
            tutors: 'Lehrer',
            subjects: 'Fächer',
            prices: 'Preise',
            copy: '© 2025 TutorsMD',
        },
        ru: {
            lang: 'Язык',
            menu: 'Меню',
            company: 'Компания',
            help: 'Помощь',
            about: 'О нас',
            privacy: 'Конфиденциальность',
            faq: 'Вопросы',
            support: 'Поддержка',
            tutors: 'Учителя',
            subjects: 'Предметы',
            prices: 'Цены',
            copy: '© 2025 TutorsMD',
        },
        en: {
            lang: 'Language',
            menu: 'Menu',
            company: 'Company',
            help: 'Help',
            about: 'About us',
            privacy: 'Privacy',
            faq: 'FAQ',
            support: 'Support',
            tutors: 'Tutors',
            subjects: 'Subjects',
            prices: 'Prices',
            copy: '© 2025 TutorsMD',
        },
    };
    const l = t[lang] ?? t.de;
    return (_jsx("footer", { className: "bg-gray-900 text-gray-400 mt-auto", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white font-bold text-xl mb-3", children: "TutorsMD" }), _jsx("p", { className: "text-sm mb-4", children: "Online-Nachhilfe in Mathematik und Deutsch." }), _jsx(LanguageSwitcher, {})] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white text-sm font-semibold mb-3 uppercase tracking-wide", children: l.menu }), _jsxs("ul", { className: "space-y-2", children: [_jsx(FooterLink, { to: "/tutors", label: l.tutors }), _jsx(FooterLink, { to: "/#subjects", label: l.subjects }), _jsx(FooterLink, { to: "/#prices", label: l.prices }), _jsx(FooterLink, { to: "/faq", label: l.faq })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white text-sm font-semibold mb-3 uppercase tracking-wide", children: l.company }), _jsxs("ul", { className: "space-y-2", children: [_jsx(FooterLink, { to: "/about", label: l.about }), _jsx(FooterLink, { to: "/privacy", label: l.privacy })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-white text-sm font-semibold mb-3 uppercase tracking-wide", children: l.help }), _jsxs("ul", { className: "space-y-2", children: [_jsx(FooterLink, { to: "/faq", label: l.faq }), isAuthenticated && (_jsx(FooterLink, { to: "/support", label: l.support }))] })] })] }), _jsxs("div", { className: "border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row\r\n          items-center justify-between gap-2", children: [_jsx("p", { className: "text-xs text-gray-500", children: l.copy }), _jsxs("div", { className: "flex gap-4", children: [_jsx(FooterLink, { to: "/privacy", label: l.privacy, small: true }), _jsx(FooterLink, { to: "/faq", label: l.faq, small: true })] })] })] }) }));
};
const FooterLink = ({ to, label, small, }) => (_jsx("li", { className: small ? undefined : undefined, children: _jsx(Link, { to: to, className: `hover:text-white transition ${small ? 'text-xs text-gray-500' : 'text-sm'}`, children: label }) }));
