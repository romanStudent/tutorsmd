import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { UserMenu }         from './UserMenu';
import { SideMenu }         from './SideMenu';
import { LanguageSwitcher } from '../../../shared/index';
import { useTranslation }   from 'react-i18next';

const NAV_LINKS_PUBLIC = [
  { key: 'tutors', to: '/tutors' },
  { key: 'faq',    to: '/faq' },
];

const NAV_LINKS_AUTH: Record<string, { key: string; to: string }[]> = {
  client: [
    { key: 'dashboard', to: '/dashboard' },
    { key: 'tutors',    to: '/tutors' },
    { key: 'lessons',   to: '/lessons' },
    { key: 'support',   to: '/support' }, 
  ],
  tutor: [
    { key: 'dashboard', to: '/dashboard' },
    { key: 'lessons',   to: '/lessons' },
    { key: 'support',   to: '/support' },   
  ],
  admin: [
    { key: 'dashboard', to: '/dashboard' },
    { key: 'messages',  to: '/admin/messages' },
  ],
};

export const Header = () => {
  const { t }           = useTranslation('nav');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole      = useSelector(selectActiveRole);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const navLinks = isAuthenticated && activeRole
    ? (NAV_LINKS_AUTH[activeRole] ?? NAV_LINKS_PUBLIC)
    : NAV_LINKS_PUBLIC;

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 font-bold text-xl text-blue-600">
            TutorsMD
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-blue-600
                   ${isActive
                     ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                     : 'text-slate-600'}`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <UserMenu />

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
              onClick={() => setSideMenuOpen(true)}
              aria-label={t('openMenu')}
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      <SideMenu
        links={navLinks}
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
      />
    </>
  );
};