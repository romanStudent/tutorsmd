import { useTranslation } from 'react-i18next';
import { Layout } from '@widgets/layout/ui/Layout';

const CONTENT = {
  de: `Warum sollten Sie uns für Deutsch- und Mathematikunterricht wählen?

Unsere Lehrer verfügen über zwei Jahre Erfahrung im Unterrichten von Deutsch und Mathematik und helfen Ihnen dabei, hervorragende Ergebnisse zu erzielen. Wir wissen, dass jeder Schüler einzigartig ist — deshalb entwickeln wir personalisierte Programme, die Ihren Zielen entsprechen.

Deutsch: Moderne Lehrmethoden, Konversationspraxis, Grammatikübungen und landeskundliche Aspekte machen das Lernen effektiv und unterhaltsam.

Mathematik: Von den Grundlagen bis zu komplexen Aufgaben — wir erklären klar und bieten praktische Übungen, die das Wissen festigen.`,

  ru: `Почему стоит выбрать нас для обучения немецкому языку и математике?

Наши преподаватели с двухлетним опытом помогут вам достичь отличных результатов. Мы понимаем, что каждый ученик уникален, и разрабатываем персонализированные программы.

Немецкий язык: Современные методы, разговорная практика и грамматика делают обучение эффективным и увлекательным.

Математика: От базовых понятий до сложных задач — объясняем просто, закрепляем практикой.`,

  en: `Why choose us for German and Math tutoring?

Our tutors have two years of experience helping students achieve excellent results. Every student is unique — we develop personalized programs to match your goals.

German: Modern teaching methods, conversation practice, and grammar exercises make learning effective and enjoyable.

Math: From basics to complex problems — clear explanations and practical exercises to build confidence.`,
};

export default function AboutPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'de' | 'ru' | 'en';
  const content = CONTENT[lang] ?? CONTENT.de;

  const greeting: Record<string, string> = {
    de: 'Hallo!',
    ru: 'Привет!',
    en: 'Hello!',
  };

  return (
    <Layout>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: 'white',
          backgroundImage:
            'radial-gradient(circle, rgba(243,134,17,0.1) 3px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {greeting[lang] ?? greeting.de}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </Layout>
  );
}


