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
      lang:    'Sprache',
      menu:    'Menü',
      company: 'Unternehmen',
      help:    'Hilfe',
      about:   'Über uns',
      privacy: 'Datenschutz',
      faq:     'FAQ',
      support: 'Support',
      tutors:  'Lehrer',
      subjects:'Fächer',
      prices:  'Preise',
      copy:    '© 2025 TutorsMD',
    },
    ru: {
      lang:    'Язык',
      menu:    'Меню',
      company: 'Компания',
      help:    'Помощь',
      about:   'О нас',
      privacy: 'Конфиденциальность',
      faq:     'Вопросы',
      support: 'Поддержка',
      tutors:  'Учителя',
      subjects:'Предметы',
      prices:  'Цены',
      copy:    '© 2025 TutorsMD',
    },
    en: {
      lang:    'Language',
      menu:    'Menu',
      company: 'Company',
      help:    'Help',
      about:   'About us',
      privacy: 'Privacy',
      faq:     'FAQ',
      support: 'Support',
      tutors:  'Tutors',
      subjects:'Subjects',
      prices:  'Prices',
      copy:    '© 2025 TutorsMD',
    },
  };

  const l = t[lang as keyof typeof t] ?? t.de;

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Бренд + язык */}
          <div>
            <p className="text-white font-bold text-xl mb-3">TutorsMD</p>
            <p className="text-sm mb-4">Online-Nachhilfe in Mathematik und Deutsch.</p>
            <LanguageSwitcher />
          </div>

          {/* Меню */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
              {l.menu}
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/tutors"   label={l.tutors} />
              <FooterLink to="/#subjects" label={l.subjects} />
              <FooterLink to="/#prices"   label={l.prices} />
              <FooterLink to="/faq"       label={l.faq} />
            </ul>
          </div>

          {/* Компания */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
              {l.company}
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/about"   label={l.about} />
              <FooterLink to="/privacy" label={l.privacy} />
            </ul>
          </div>

          {/* Помощь */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
              {l.help}
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/faq" label={l.faq} />
              {isAuthenticated && (
                <FooterLink to="/support" label={l.support} />
              )}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{l.copy}</p>
          <div className="flex gap-4">
            <FooterLink to="/privacy" label={l.privacy} small />
            <FooterLink to="/faq"     label={l.faq} small />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  to, label, small,
}: { to: string; label: string; small?: boolean }) => (
  <li className={small ? undefined : undefined}>
    <Link
      to={to}
      className={`hover:text-white transition ${small ? 'text-xs text-gray-500' : 'text-sm'}`}
    >
      {label}
    </Link>
  </li>
);