// Заменяет Cabinet + ModalButton + LoginedPersonCabinet

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { useLogoutMutation } from '@shared/api/authApi';
import { useGetUserProfileQuery } from '@shared/api/profileApi';

export const UserMenu = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole      = useSelector(selectActiveRole);
  const navigate        = useNavigate();
  const [logout]        = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const menuRef         = useRef<HTMLDivElement>(null);

  // Профиль подгружается автоматически если залогинен
  const { data: profile } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Закрытие по клику вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          Anmelden
        </Link>
        <Link
          to="/register"
          className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Registrieren
        </Link>
      </div>
    );
  }

  // Залогиненный — аватар + дропдаун
  const initials = profile
    ? `${profile.name[0]}${profile.surname[0]}`.toUpperCase()
    : activeRole?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm
          flex items-center justify-center hover:bg-blue-700 transition focus:outline-none"
        aria-label="Benutzerprofil"
      >
        {profile?.avatarUrl
          ? <img src={profile.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
          : initials
        }
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100
          py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-100">

          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {profile ? `${profile.name} ${profile.surname}` : '...'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{activeRole}</p>
          </div>

          {/* Links */}
          <MenuLink to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </MenuLink>
          <MenuLink to="/settings" onClick={() => setOpen(false)}>
            Einstellungen
          </MenuLink>
          <MenuLink to="/settings/media" onClick={() => setOpen(false)}>
            Kamera & Mikrofon testen
          </MenuLink>

          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600
                hover:bg-red-50 transition"
            >
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
  >
    {children}
  </Link>
);