const LOCALES = {
  ENGLISH: 'en',
  RUSSIAN: 'ru',
  GERMAN: 'de',
} as const;

export type Locale = typeof LOCALES[keyof typeof LOCALES];
export default LOCALES;