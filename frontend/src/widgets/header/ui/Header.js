import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { UserMenu } from './UserMenu';
import { SideMenu } from './SideMenu';
import { LanguageSwitcher } from '../../../shared/index';
import { useTranslation } from 'react-i18next';
const NAV_LINKS_PUBLIC = [
    { key: 'nav.tutors', to: '/tutors' },
    { key: 'nav.subjects', to: '/#subjects' },
    { key: 'nav.prices', to: '/#prices' },
    { key: 'nav.faq', to: '/faq' },
];
const NAV_LINKS_AUTH = {
    client: [
        { key: 'nav.dashboard', to: '/dashboard' },
        { key: 'nav.tutors', to: '/tutors' },
        { key: 'nav.lessons', to: '/lessons' },
    ],
    tutor: [
        { key: 'nav.dashboard', to: '/dashboard' },
        { key: 'nav.lessons', to: '/lessons' },
        { key: 'nav.schedule', to: '/schedule' },
    ],
    admin: [
        { key: 'nav.dashboard', to: '/dashboard' },
        { key: 'nav.messages', to: '/admin/messages' },
    ],
};
export const Header = () => {
    const { t } = useTranslation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const activeRole = useSelector(selectActiveRole);
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const navLinks = isAuthenticated && activeRole
        ? (NAV_LINKS_AUTH[activeRole] ?? NAV_LINKS_PUBLIC)
        : NAV_LINKS_PUBLIC;
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "w-full bg-white border-b border-gray-200 sticky top-0 z-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4", children: [_jsx(Link, { to: "/", className: "flex-shrink-0 font-bold text-xl text-blue-600", children: "TutorsMD" }), _jsx("nav", { className: "hidden md:flex items-center gap-6 flex-1", children: navLinks.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => `text-sm font-medium transition hover:text-blue-600
                   ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'text-gray-700'}`, children: t(link.key) }, link.to))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(LanguageSwitcher, {}), _jsx(UserMenu, {}), _jsx("button", { className: "md:hidden p-2 rounded-lg hover:bg-gray-100 transition", onClick: () => setSideMenuOpen(true), "aria-label": "Men\u00FC \u00F6ffnen", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) })] })] }) }), _jsx(SideMenu, { links: navLinks, isOpen: sideMenuOpen, onClose: () => setSideMenuOpen(false) })] }));
};
