import { Layout } from '@widgets/layout/index';
import { Spinner } from '@shared/index';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { useLikedTutors } from '@shared/lib/useLikedTutors';
import { LikeButton } from '@shared/ui/LikeButton';

export default function LikedTutorsPage() {
  const { t, i18n } = useTranslation('likedTutors');
  const lang = i18n.language;

  const { likedIds, remove } = useLikedTutors();

  const { data, isLoading } = useGetTutorsQuery(
    {},
    { skip: likedIds.length === 0 },
  );

  // Фильтруем на клиенте по likedIds
  const likedTutors = (data?.tutors ?? []).filter(t => likedIds.includes(t.id));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
          {t('title')}
        </h1>

        {isLoading && likedIds.length > 0 ? (
          <Spinner />
        ) : likedTutors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-14 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-slate-500 text-sm mb-6">{t('empty')}</p>
            <Link
              to="/tutors"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white
                text-sm font-medium px-6 py-2.5 rounded-xl transition
                shadow-lg shadow-orange-200"
            >
              {t('findBtn')}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedTutors.map(tutor => {
                const name = lang === 'de' && tutor.nameDe
                  ? `${tutor.nameDe} ${tutor.surnameDe ?? ''}`.trim()
                  : lang === 'ru' && tutor.nameRu
                  ? `${tutor.nameRu} ${tutor.surnameRu ?? ''}`.trim()
                  : `${tutor.name} ${tutor.surname}`;

                const highlight = lang === 'ru' && tutor.highlightRu
                  ? tutor.highlightRu
                  : tutor.highlightDe;

                return (
                  <div
                    key={tutor.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
                      relative group"
                  >
                    {/* LikeButton переиспользован — при клике убирает из избранного */}
                    <LikeButton
                      tutorId={tutor.id}
                      className="absolute top-4 right-4"
                      onRemove={() => remove(tutor.id)}
                    />

                    <Link to={`/tutors/${tutor.id}`} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center
                        justify-center text-blue-600 font-bold text-lg flex-shrink-0 overflow-hidden">
                        {tutor.avatarUrl
                          ? <img src={tutor.avatarUrl} alt="" className="w-12 h-12 object-cover" />
                          : `${tutor.name[0]}${tutor.surname[0]}`}
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <p className="font-semibold text-slate-900 text-sm
                          group-hover:text-blue-600 transition-colors truncate">
                          {name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ⭐ {tutor.ratingAvg.toFixed(1)}{' '}
                          <span className="text-slate-300">
                            ({tutor.ratingCount} {t('rate')})
                          </span>
                        </p>
                        {highlight && (
                          <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {highlight}
                          </p>
                        )}
                        {/*
                        tutor.hourlyRate && (
                          <p className="text-sm font-semibold text-slate-900 mt-2">
                            {tutor.hourlyRate} {t('perHour')}
                          </p>
                        )
                          */}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/tutors"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t('findBtn')} →
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}