import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SubjectItem {
  name:   string;
  icon:   string;
  levels: string[];
  desc:   string;
}

export const SubjectsSection = () => {
  const { t } = useTranslation('home');

  const subjects = t('subjects.items', { returnObjects: true }) as SubjectItem[];

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
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8 text-center">
          {t('subjects.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900">{subject.name}</h3>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">{subject.desc}</p>

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
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white
              font-semibold px-8 py-3 rounded-xl transition text-sm
              shadow-lg shadow-orange-200"
          >
            {t('subjects.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};