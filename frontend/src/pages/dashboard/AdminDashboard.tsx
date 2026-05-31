import { Lesson } from '@entities/lesson/model/types';
import {
  useGetPendingTutorsQuery,
  useApproveTutorMutation,
  useRejectTutorMutation,
} from '@shared/api/tutor/tutorApi';
import { Spinner, useGetUserLessonsQuery } from '@shared/index';
import { LessonCard } from '@widgets/lesson-card/index';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AdminDashboard = () => {
  const { t } = useTranslation('dashboard');

  const { data: tutorsData, isLoading: tutorsLoading } = useGetPendingTutorsQuery();
  const { data: lessonsData, isLoading: lessonsLoading } = useGetUserLessonsQuery({});

  const [approve, { isLoading: approving }] = useApproveTutorMutation();
  const [reject,  { isLoading: rejecting }] = useRejectTutorMutation();

  const pendingTutors    = tutorsData?.tutors ?? [];
  const allLessons       = lessonsData?.lessons ?? [];
  const pendingLessons   = allLessons.filter((l: Lesson) => l.status === 'pending');
  const confirmedLessons = allLessons.filter((l: Lesson) => l.status === 'confirmed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {t('admin.title')}
      </h1>

      {/* Pending tutors */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {t('admin.pendingTutors.title')} ({pendingTutors.length})
        </h2>

        {tutorsLoading ? (
          <Spinner />
        ) : pendingTutors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-slate-500 text-sm">{t('admin.pendingTutors.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTutors.map((tutor) => (
              <div
                key={tutor.tutorId}
                className="bg-white rounded-3xl border border-slate-200
                  p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {tutor.name} {tutor.surname}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{tutor.email}</p>
                  {tutor.nameDe && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('admin.pendingTutors.nameDe')}: {tutor.nameDe}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve({ tutorId: tutor.tutorId })}
                    disabled={approving}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50
                      text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                  >
                    {t('admin.pendingTutors.approve')}
                  </button>
                  <button
                    onClick={() => reject({ tutorId: tutor.tutorId })}
                    disabled={rejecting}
                    className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600
                      text-sm font-medium px-4 py-2 rounded-xl transition border border-red-200"
                  >
                    {t('admin.pendingTutors.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction to="/lessons"         icon="📅" label={t('admin.quickActions.lessons')} />
          <QuickAction to="/settings"        icon="📝" label={t('admin.quickActions.profile')} />
          <QuickAction to="/settings/media"  icon="🎥" label={t('admin.quickActions.camera')} />
        </div>
      </section>

      {/* Pending lessons */}
      {pendingLessons.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {t('admin.pendingLessons.title')} ({pendingLessons.length})
          </h2>
          <div className="space-y-3">
            {pendingLessons.map((lesson: Lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} role="tutor" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming lessons */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('admin.upcomingLessons.title')}
          </h2>
          <Link
            to="/lessons"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline self-start sm:self-auto"
          >
            {t('admin.upcomingLessons.viewAll')}
          </Link>
        </div>

        {lessonsLoading ? (
          <Spinner />
        ) : confirmedLessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-slate-500 text-sm">{t('admin.upcomingLessons.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmedLessons.slice(0, 5).map((lesson: Lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} role="tutor" />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

const QuickAction = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <Link
    to={to}
    className="bg-white rounded-3xl border border-slate-200
      p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200
      flex items-center gap-3 group"
  >
    <span className="text-2xl">{icon}</span>
    <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
      {label}
    </p>
  </Link>
);