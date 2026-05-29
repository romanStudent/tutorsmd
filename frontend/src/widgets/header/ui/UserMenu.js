import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Заменяет Cabinet + ModalButton + LoginedPersonCabinet
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { useLogoutMutation } from '@shared/api/authApi';
import { useGetUserProfileQuery } from '@shared/api/profileApi';
export const UserMenu = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const activeRole = useSelector(selectActiveRole);
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    // Профиль подгружается автоматически если залогинен
    const { data: profile } = useGetUserProfileQuery(undefined, {
        skip: !isAuthenticated,
    });
    // Закрытие по клику вне
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const handleLogout = async () => {
        setOpen(false);
        await logout();
        navigate('/');
    };
    // Незалогиненный — кнопка входа
    if (!isAuthenticated) {
        return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: "/login", className: "text-sm font-medium text-gray-700 hover:text-blue-600 transition", children: "Anmelden" }), _jsx(Link, { to: "/register", className: "text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition", children: "Registrieren" })] }));
    }
    // Залогиненный — аватар + дропдаун
    const initials = profile
        ? `${profile.name[0]}${profile.surname[0]}`.toUpperCase()
        : activeRole?.[0]?.toUpperCase() ?? '?';
    return (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsx("button", { onClick: () => setOpen((v) => !v), className: "w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm\r\n          flex items-center justify-center hover:bg-blue-700 transition focus:outline-none", "aria-label": "Benutzerprofil", children: profile?.avatarUrl
                    ? _jsx("img", { src: profile.avatarUrl, alt: "", className: "w-10 h-10 rounded-full object-cover" })
                    : initials }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100\r\n          py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-100", children: [_jsxs("div", { className: "px-4 py-3 border-b border-gray-100", children: [_jsx("p", { className: "text-sm font-semibold text-gray-900 truncate", children: profile ? `${profile.name} ${profile.surname}` : '...' }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: activeRole })] }), _jsx(MenuLink, { to: "/dashboard", onClick: () => setOpen(false), children: "Dashboard" }), _jsx(MenuLink, { to: "/settings", onClick: () => setOpen(false), children: "Einstellungen" }), _jsx(MenuLink, { to: "/settings/media", onClick: () => setOpen(false), children: "Kamera & Mikrofon testen" }), _jsx("div", { className: "border-t border-gray-100 mt-1", children: _jsx("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 text-sm text-red-600\r\n                hover:bg-red-50 transition", children: "Abmelden" }) })] }))] }));
};
const MenuLink = ({ to, onClick, children, }) => (_jsx(Link, { to: to, onClick: onClick, className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition", children: children }));
