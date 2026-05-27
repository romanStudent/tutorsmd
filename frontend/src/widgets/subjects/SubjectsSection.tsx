import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUBJECTS = {
  de: [
    {
      name:  'Mathematik',
      icon:  '📐',
      levels: ['Klassen 1–13', 'Klausuren', 'Abitur'],
      desc:  'Von Grundschulmathematik bis zum Abitur — klare Erklärungen und praktische Übungen.',
    },
    {
      name:  'Deutsch',
      icon:  '📖',
      levels: ['A0–B2', 'Telc', 'DSH', 'Goethe'],
      desc:  'Grammatik, Konversation und Prüfungsvorbereitung — für alle Niveaus.',
    },
  ],
  ru: [
    {
      name:  'Математика',
      icon:  '📐',
      levels: ['1–13 класс', 'Экзамены', 'Абитур'],
      desc:  'От школьной математики до абитура — понятные объяснения и практика.',
    },
    {
      name:  'Немецкий язык',
      icon:  '📖',
      levels: ['A0–B2', 'Telc', 'DSH', 'Goethe'],
      desc:  'Грамматика, разговорная практика и подготовка к экзаменам.',
    },
  ],
  en: [
    {
      name:  'Mathematics',
      icon:  '📐',
      levels: ['Grades 1–13', 'Exams', 'Abitur'],
      desc:  'From school math to Abitur — clear explanations and practice.',
    },
    {
      name:  'German',
      icon:  '📖',
      levels: ['A0–B2', 'Telc', 'DSH', 'Goethe'],
      desc:  'Grammar, conversation and exam preparation — for all levels.',
    },
  ],
};

const TITLES = {
  de: { title: 'Fächer', cta: 'Jetzt Probestunde buchen' },
  ru: { title: 'Предметы', cta: 'Записаться на пробный урок' },
  en: { title: 'Subjects', cta: 'Book a trial lesson' },
};

export const SubjectsSection = () => {
  const { i18n } = useTranslation();
  const lang     = i18n.language as 'de' | 'ru' | 'en';
  const subjects = SUBJECTS[lang] ?? SUBJECTS.de;
  const t        = TITLES[lang] ?? TITLES.de;

  return (
    <section
      className="py-16"
      style={{
        backgroundColor: 'white',
        backgroundImage: 'radial-gradient(circle, rgba(243,134,17,0.08) 2px, transparent 1px)',
        backgroundSize:  '24px 24px',
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t.title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {subject.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {subject.levels.map((level) => (
                  <span
                    key={level}
                    className="bg-blue-50 text-blue-700 text-xs font-medium
                      px-3 py-1 rounded-full"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/tutors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white
              font-semibold px-8 py-3 rounded-xl transition text-sm"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
};