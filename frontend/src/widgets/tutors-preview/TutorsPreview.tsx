import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { Spinner } from '@shared/index';

export const TutorsPreview = () => {
  const { t, i18n } = useTranslation('home');
  const lang = i18n.language;

  const { data, isLoading } = useGetTutorsQuery({ limit: 3, page: 1 });
  const tutors = data?.tutors ?? [];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {t('tutorsPreview.title')}
        </h2>
        <Link
          to="/tutors"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto"
        >
          {t('tutorsPreview.viewAll')} →
        </Link>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tutors.map((tutor) => (
            <Link
              key={tutor.id}
              to={`/tutors/${tutor.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-5
                hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center
                justify-center text-blue-600 font-bold text-xl mb-4 flex-shrink-0 overflow-hidden">
                {tutor.avatarUrl
                  ? <img src={tutor.avatarUrl} alt="" className="w-14 h-14 object-cover" />
                  : `${tutor.name[0]}${tutor.surname[0]}`}
              </div>

              {/* Name */}
              <p className="font-semibold text-slate-900 text-sm
                group-hover:text-blue-600 transition-colors">
                {lang === 'de' && tutor.nameDe
                  ? `${tutor.nameDe} ${tutor.surnameDe}`
                  : lang === 'ru' && tutor.nameRu
                  ? `${tutor.nameRu} ${tutor.surnameRu}`
                  : `${tutor.name} ${tutor.surname}`}
              </p>

              {/* Rating */}
              <p className="text-xs text-slate-400 mt-0.5">
                ⭐ {tutor.ratingAvg.toFixed(1)}{' '}
                <span className="text-slate-300">
                  ({tutor.ratingCount} {t('tutorsPreview.reviews')})
                </span>
              </p>

              {/* Highlight */}
              {(tutor.highlightDe || tutor.highlightRu) && (
                <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {lang === 'ru' && tutor.highlightRu
                    ? tutor.highlightRu
                    : tutor.highlightDe}
                </p>
              )}


              {/* Rate
              {tutor.hourlyRate && (
                <p className="text-sm font-semibold text-slate-900 mt-3">
                  {tutor.hourlyRate} {t('tutorsPreview.perHour')}
                </p>
              )}
              */}
              
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};