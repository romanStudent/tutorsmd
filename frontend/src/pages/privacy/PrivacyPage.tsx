import { useTranslation } from 'react-i18next';
import { Layout } from '@widgets/layout/ui/Layout';

const SECTIONS_DE = [
  {
    title: 'Welche Daten wir erheben',
    content: 'Wir erheben Name, E-Mail-Adresse und technische Daten, die für den Betrieb der Plattform notwendig sind.',
  },
  {
    title: 'Wie wir Ihre Daten verwenden',
    content: 'Ihre Daten werden ausschließlich für den Betrieb der Plattform und die Kommunikation mit Ihnen genutzt. Wir geben keine Daten an Dritte weiter.',
  },
  {
    title: 'Datenspeicherung',
    content: 'Ihre Daten werden auf sicheren Servern in der EU gespeichert und nach Löschung des Kontos innerhalb von 30 Tagen entfernt.',
  },
  {
    title: 'Ihre Rechte',
    content: 'Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Kontaktieren Sie uns unter support@tutorsmd.net.',
  },
  {
    title: 'Cookies',
    content: 'Wir verwenden nur technisch notwendige Cookies für die Authentifizierung. Es werden keine Werbe-Cookies eingesetzt.',
  },
];

const SECTIONS_RU = [
  {
    title: 'Какие данные мы собираем',
    content: 'Мы собираем имя, адрес электронной почты и технические данные, необходимые для работы платформы.',
  },
  {
    title: 'Как мы используем ваши данные',
    content: 'Ваши данные используются исключительно для работы платформы и общения с вами. Мы не передаём данные третьим лицам.',
  },
  {
    title: 'Хранение данных',
    content: 'Данные хранятся на защищённых серверах в ЕС. После удаления аккаунта данные удаляются в течение 30 дней.',
  },
  {
    title: 'Ваши права',
    content: 'Вы имеете право на доступ, исправление и удаление ваших данных. Напишите нам на support@tutorsmd.net.',
  },
  {
    title: 'Cookies',
    content: 'Мы используем только технически необходимые cookie для аутентификации. Рекламные cookie не используются.',
  },
];

const SECTIONS_EN = [
  {
    title: 'What data we collect',
    content: 'We collect your name, email address, and technical data necessary to operate the platform.',
  },
  {
    title: 'How we use your data',
    content: 'Your data is used solely to operate the platform and communicate with you. We do not share data with third parties.',
  },
  {
    title: 'Data storage',
    content: 'Data is stored on secure EU servers and deleted within 30 days of account deletion.',
  },
  {
    title: 'Your rights',
    content: 'You have the right to access, correct, and delete your data. Contact us at support@tutorsmd.net.',
  },
  {
    title: 'Cookies',
    content: 'We only use technically necessary cookies for authentication. No advertising cookies are used.',
  },
];

const SECTIONS_MAP: Record<string, typeof SECTIONS_DE> = {
  de: SECTIONS_DE,
  ru: SECTIONS_RU,
  en: SECTIONS_EN,
};

const TITLES: Record<string, string> = {
  de: 'Datenschutzerklärung',
  ru: 'Политика конфиденциальности',
  en: 'Privacy Policy',
};

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const sections = SECTIONS_MAP[lang] ?? SECTIONS_DE;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {TITLES[lang] ?? TITLES.de}
        </h1>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-12">
          Stand: Mai 2025 · tutorsmd.net
        </p>
      </div>
    </Layout>
  );
}