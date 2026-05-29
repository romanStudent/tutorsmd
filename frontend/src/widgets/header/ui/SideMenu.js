import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Мобильное меню — заменяет старый SideMenu
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../../../shared/index';
export const SideMenu = ({ links, isOpen, onClose }) => {
    const { t } = useTranslation();
    // Блокируем скролл body когда меню открыто
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/50 z-40 md:hidden", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }, "backdrop"), _jsxs(motion.aside, { className: "fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden\r\n              flex flex-col shadow-xl", initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' }, transition: { type: 'tween', duration: 0.25 }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-4 border-b border-gray-100", children: [_jsx("span", { className: "font-bold text-xl text-blue-600", children: "TutorsMD" }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg hover:bg-gray-100 transition", "aria-label": "Men\u00FC schlie\u00DFen", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-4 space-y-1", children: links.map((link) => (_jsx(NavLink, { to: link.to, onClick: onClose, className: ({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium transition
                     ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'}`, children: t(link.key) }, link.to))) }), _jsxs("div", { className: "px-4 py-4 border-t border-gray-100 flex items-center justify-between", children: [_jsx(LanguageSwitcher, {}), _jsx(UserMenu, {})] })] }, "drawer")] })) }));
};
