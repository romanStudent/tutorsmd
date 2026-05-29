
// Избранные тьюторы хранятся в localStorage — сервер не трогаем.
// Список тьюторов по ID получаем через RTK Query (useGetTutorsQuery с фильтром).
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTutorsQuery } from '@shared/api/tutor/tutorPublicApi';
import { Layout }  from '@widgets/layout/ui/Layout';
import { Spinner } from '@shared/index';

// ─── localStorage helpers ─────────────────────────────────────
const LS_KEY = 'likedTutors';

export const getLikedIds = (): string[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); }
  catch { return []; }
};

export const toggleLike = (tutorId: string): string[] => {
  const ids = getLikedIds();
  const next = ids.includes(tutorId)
    ? ids.filter(id => id !== tutorId)
    : [...ids, tutorId];
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  return next;
};

export const isLiked = (tutorId: string): boolean =>
  getLikedIds().includes(tutorId);

// ─── LikedTutorsPage ─────────────────────────────────────────
export default function LikedTutorsPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [likedIds, setLikedIds] = useState<string[]>([]);

  useEffect(() => {
    setLikedIds(getLikedIds());
  }, []);

  // Загружаем до 50 тьюторов, фильтруем на клиенте по liked IDs
  // Альтернатива: добавить endpoint GET /tutors?ids=... на бэкенде
  const { data, isLoading } = useGetTutorsQuery(
    { limit: 50, page: 1 },
    { skip: likedIds.length === 0 },
  );

  const likedTutors = (data?.tutors ?? []).filter(t => likedIds.includes(t.id));

  const labels = {
    de: {
      title:    likedTutors.length > 0 ? 'Bevorzugte Lehrer' : 'Keine bevorzugten Lehrer',
      empty:    'Sie haben noch keine Lehrer als Favoriten markiert.',
      findBtn:  'Lehrer finden',
      remove:   'Entfernen',
      rate:     'Bewertungen',
      perHour:  '€/Std.',
    },
    ru: {
      title:    likedTutors.length > 0 ? 'Понравившиеся репетиторы' : 'Нет понравившихся репетиторов',
      empty:    'Вы ещё не добавили ни одного репетитора в избранное.',
      findBtn:  'Найти репетитора',
      remove:   'Удалить',
      rate:     'отзывов',
      perHour:  '€/час',
    },
    en: {
      title:    likedTutors.length > 0 ? 'Favourite tutors' : 'No favourite tutors',
      empty:    'You have not added any tutors to favourites yet.',
      findBtn:  'Find a tutor',
      remove:   'Remove',
      rate:     'reviews',
      perHour:  '€/h',
    },
  };
  const l = labels[lang as keyof typeof labels] ?? labels.de;

  const handleRemove = (tutorId: string) => {
    setLikedIds(toggleLike(tutorId));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{l.title}</h1>

        {isLoading && likedIds.length > 0 ? (
          <Spinner />
        ) : likedTutors.length === 0 ? (
          // ── Пусто ──────────────────────────────────────────
          <div className="bg-white rounded-2xl border border-dashed border-gray-200
            p-12 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-gray-500 text-sm mb-6">{l.empty}</p>
            <Link to="/tutors"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white
                text-sm font-medium px-6 py-2 rounded-lg transition">
              {l.findBtn}
            </Link>
          </div>
        ) : (
          // ── Список ─────────────────────────────────────────
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
                <div key={tutor.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5
                    hover:shadow-md transition relative group">

                  {/* Кнопка удалить */}
                  <button
                    onClick={() => handleRemove(tutor.id)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500
                      transition text-lg"
                    title={l.remove}
                  >
                    ♥
                  </button>

                  <Link to={`/tutors/${tutor.id}`} className="flex items-start gap-4">
                    {/* Аватар */}
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center
                      justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                      {tutor.avatarUrl
                        ? <img src={tutor.avatarUrl} alt=""
                            className="w-12 h-12 rounded-xl object-cover" />
                        : `${tutor.name[0]}${tutor.surname[0]}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600
                        transition truncate">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ⭐ {tutor.ratingAvg.toFixed(1)} ({tutor.ratingCount} {l.rate})
                      </p>
                      {highlight && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{highlight}</p>
                      )}
                      {tutor.hourlyRate && (
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          {tutor.hourlyRate} {l.perHour}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {likedTutors.length > 0 && (
          <div className="text-center mt-6">
            <Link to="/tutors"
              className="text-sm text-blue-600 hover:underline">
              {l.findBtn} →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}