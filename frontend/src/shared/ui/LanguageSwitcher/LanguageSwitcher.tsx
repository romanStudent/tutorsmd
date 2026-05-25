
// Заменяет старый Language компонент
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const;

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current  = i18n.language;

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition
            ${current === code
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};