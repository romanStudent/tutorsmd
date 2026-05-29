import { useGetUserProfileQuery } from '@shared/api/profileApi';
import { useGetTutorProfileQuery } from '@shared/api/tutor/tutorApi';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { LessonCard } from '@widgets/lesson-card';
import { Spinner } from '@shared/index';
import { Link } from 'react-router-dom';

export const TutorDashboard = () => {
  const { data: profile } = useGetUserProfileQuery();
  const { data: tutorProfile } = useGetTutorProfileQuery();
  const { data: lessonsData, isLoading } = useGetUserLessonsQuery({});

  const lessons = lessonsData?.lessons ?? [];

  // ─── Группировка по статусам ─────────────────────────────
  const pendingLessons = lessons.filter(l => l.status === 'pending');
  const upcomingLessons = lessons.filter(l => l.status === 'confirmed');
  const activeLessons = lessons.filter(l => l.status === 'in_progress');

  // ─── Approval ────────────────────────────────────────────
  const isPending = tutorProfile?.approvalStatus === 'pending';
  const isApproved = tutorProfile?.approvalStatus === 'approved';
  const isRejected = tutorProfile?.approvalStatus === 'rejected';

  return (
    <div className="space-y-8">

      {/* ─── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Willkommen, {profile?.name}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bewertung: ⭐ {tutorProfile?.ratingAvg?.toFixed(1) ?? '0.0'} ({tutorProfile?.ratingCount ?? 0})
          </p>
        </div>

        {isPending && (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1.5 rounded-full">
            Profil wird geprüft
          </span>
        )}

        {isRejected && (
          <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full">
            Profil abgelehnt
          </span>
        )}
      </div>

      {/* ─── Banner ───────────────────────────────────────── */}
      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <p className="text-sm text-yellow-800 font-medium">
            Ihr Profil wird überprüft.
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Nach der Freischaltung können Schüler Unterricht buchen.
          </p>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-800 font-medium">
            Ihr Profil wurde abgelehnt.
          </p>
          <p className="text-sm text-red-700 mt-1">
            Bitte aktualisieren Sie Ihr Profil oder kontaktieren Sie den Support.
          </p>
        </div>
      )}

      {/* ─── Основной контент только для approved ─────────── */}
      {isApproved && (
        <>

          {/* ─── Quick Actions ───────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickAction to="/lessons" icon="📅" title="Alle Unterrichte" />
            <QuickAction to="/settings" icon="📝" title="Profil bearbeiten" />
            <QuickAction to="/settings/media" icon="🎥" title="Kamera testen" />
          </div>

          {/* ─── Loading ───────────────────────────────── */}
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {/* ─── Active lessons ───────────────────── */}
              {activeLessons.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Laufende Unterrichtsstunden ({activeLessons.length})
                  </h2>
                  <div className="space-y-3">
                    {activeLessons.map(lesson => (
                      <LessonCard key={lesson.id} lesson={lesson} role="tutor" />
                    ))}
                  </div>
                </section>
              )}

              {/* ─── Pending requests ─────────────────── */}
              {pendingLessons.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Neue Anfragen ({pendingLessons.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingLessons.map(lesson => (
                      <LessonCard key={lesson.id} lesson={lesson} role="tutor" />
                    ))}
                  </div>
                </section>
              )}

              {/* ─── Upcoming lessons ─────────────────── */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Geplante Unterrichtsstunden
                  </h2>
                  <Link to="/lessons" className="text-sm text-blue-600 hover:underline">
                    Alle ansehen
                  </Link>
                </div>

                {upcomingLessons.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                    <p className="text-gray-400 text-sm">
                      Keine geplanten Unterrichtsstunden.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingLessons.slice(0, 5).map(lesson => (
                      <LessonCard key={lesson.id} lesson={lesson} role="tutor" />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

const QuickAction = ({ to, icon, title }: { to: string; icon: string; title: string }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md
      transition flex items-center gap-3"
  >
    <span className="text-2xl">{icon}</span>
    <p className="font-medium text-gray-900 text-sm">{title}</p>
  </Link>
);