
// Мобильное меню — заменяет старый SideMenu
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '../../../shared/index';

interface NavItem {
  key: string;
  to:  string;
}

interface Props {
  links:   NavItem[];
  isOpen:  boolean;
  onClose: () => void;
}

export const SideMenu = ({ links, isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  // Блокируем скролл body когда меню открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            className="fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden
              flex flex-col shadow-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <span className="font-bold text-xl text-blue-600">TutorsMD</span>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Menü schließen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition
                     ${isActive
                       ? 'bg-blue-50 text-blue-600'
                       : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};