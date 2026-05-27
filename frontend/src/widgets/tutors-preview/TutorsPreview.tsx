import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { Spinner } from '@shared/index';

export const TutorsPreview = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isLoading } = useGetTutorsQuery({ limit: 3, page: 1 });
  const tutors = data?.tutors ?? [];

  const labels = {
    de: { title: 'Unsere Nachhilfelehrer', all: 'Alle Lehrer ansehen', reviews: 'Bewertungen' },
    ru: { title: 'Наши репетиторы', all: 'Смотреть всех', reviews: 'отзывов' },
    en: { title: 'Our tutors', all: 'View all tutors', reviews: 'reviews' },
  };
  const l = labels[lang as keyof typeof labels] ?? labels.de;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{l.title}</h2>
        <Link to="/tutors" className="text-sm text-blue-600 hover:underline">
          {l.all} →
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {tutors.map((tutor) => (
            <Link
              key={tutor.id}
              to={`/tutors/${tutor.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-5
                hover:shadow-md transition group"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center
                justify-center text-blue-600 font-bold text-xl mb-4 flex-shrink-0">
                {tutor.avatarUrl
                  ? <img src={tutor.avatarUrl} alt=""
                      className="w-14 h-14 rounded-2xl object-cover" />
                  : `${tutor.name[0]}${tutor.surname[0]}`
                }
              </div>

              {/* Name */}
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {lang === 'de' && tutor.nameDe
                  ? `${tutor.nameDe} ${tutor.surnameDe}`
                  : lang === 'ru' && tutor.nameRu
                  ? `${tutor.nameRu} ${tutor.surnameRu}`
                  : `${tutor.name} ${tutor.surname}`}
              </p>

              {/* Rating */}
              <p className="text-xs text-gray-400 mt-0.5">
                ⭐ {tutor.ratingAvg.toFixed(1)} ({tutor.ratingCount} {l.reviews})
              </p>

              {/* Highlight */}
              {(tutor.highlightDe || tutor.highlightRu) && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {lang === 'ru' && tutor.highlightRu
                    ? tutor.highlightRu
                    : tutor.highlightDe}
                </p>
              )}

              {/* Rate */}
              {tutor.hourlyRate && (
                <p className="text-sm font-semibold text-gray-900 mt-3">
                  {tutor.hourlyRate} €/Std.
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};