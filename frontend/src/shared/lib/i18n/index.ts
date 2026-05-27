// src/shared/lib/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: localStorage.getItem('language') ?? 'de',
    fallbackLng: 'de',
    interpolation: { escapeValue: false },
  });

// Сохраняем язык при смене
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
