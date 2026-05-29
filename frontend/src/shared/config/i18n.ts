import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LOCALES from '@shared/locales/Locales';

// Namespaces
import deCommon  from '@shared/locales/de/common.json';
import deNav     from '@shared/locales/de/nav.json';
import deAuth    from '@shared/locales/de/auth.json';
import deLesson  from '@shared/locales/de/lesson.json';
import deAbout   from '@shared/locales/de/about.json';

import ruCommon  from '@shared/locales/ru/common.json';
import ruNav     from '@shared/locales/ru/nav.json';
import ruAuth    from '@shared/locales/ru/auth.json';
import ruLesson  from '@shared/locales/ru/lesson.json';
import ruAbout   from '@shared/locales/ru/about.json';

import enCommon  from '@shared/locales/en/common.json';
import enNav     from '@shared/locales/en/nav.json';
import enAuth    from '@shared/locales/en/auth.json';
import enLesson  from '@shared/locales/en/lesson.json';
import enAbout   from '@shared/locales/en/about.json';

i18n
  .use(LanguageDetector)   // читает localStorage, navigator.language
  .use(initReactI18next)
  .init({
    resources: {
      [LOCALES.GERMAN]: {
        common: deCommon, nav: deNav,
        auth: deAuth, lesson: deLesson, about: deAbout,
      },
      [LOCALES.RUSSIAN]: {
        common: ruCommon, nav: ruNav,
        auth: ruAuth, lesson: ruLesson, about: ruAbout,
      },
      [LOCALES.ENGLISH]: {
        common: enCommon, nav: enNav,
        auth: enAuth, lesson: enLesson, about: enAbout,
      },
    },

    // Порядок определения языка:
    // 1. localStorage (ключ 'i18nextLng')
    // 2. navigator.language браузера
    // 3. fallback
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language', // совместимость со старым ключом
    },

    lng: undefined,               // язык определяет LanguageDetector
    fallbackLng: LOCALES.GERMAN,
    defaultNS: 'common',          // useTranslation() без аргумента = common

    load: 'languageOnly',         // 'de-DE' → 'de'

    interpolation: {
      escapeValue: false,         // React сам экранирует
    },
  });

// При смене языка сохраняем в localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;