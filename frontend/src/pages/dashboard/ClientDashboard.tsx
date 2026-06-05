import { useGetUserProfileQuery } from '@shared/api/profileApi';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { LessonCard }  from '@widgets/lesson-card/index';
import { Spinner }     from '@shared/index';
import { Link }        from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ClientDashboard = () => {
  const { t } = useTranslation('dashboard');

  const { data: profile, isLoading: profileLoading } = useGetUserProfileQuery();
  const { data: lessonsData, isLoading: lessonsLoading } = useGetUserLessonsQuery({});

  const lessons = lessonsData?.lessons ?? [];

  const activeLessons   = lessons.filter(l => l.status === 'in_progress');
  const pendingLessons  = lessons.filter(l => l.status === 'pending');
  const rescheduleLessons = lessons.filter(l => l.status === 'pending_reschedule');
  const upcomingLessons = lessons.filter(l => l.status === 'confirmed');

  if (profileLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {t('client.greeting', { name: profile?.name })}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{t('client.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickAction to="/tutors"  icon="🔍" title={t('client.quickActions.findTutor')}
          description={t('client.quickActions.findTutorDesc')} />
        <QuickAction to="/lessons" icon="📅" title={t('client.quickActions.lessons')}
          description={t('client.quickActions.lessonsDesc')} />
        <QuickAction to="/settings" icon="⚙️" title={t('client.quickActions.settings')}
          description={t('client.quickActions.settingsDesc')} />
      </div>

      {lessonsLoading ? <Spinner /> : (
        <>
          {/* Активные уроки — прямо сейчас */}
          {activeLessons.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                🟢 Läuft gerade ({activeLessons.length})
              </h2>
              <div className="space-y-3">
                {activeLessons.map(l => <LessonCard key={l.id} lesson={l} role="client" />)}
              </div>
            </section>
          )}

          {/* Предложения о переносе */}
          {rescheduleLessons.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                📅 Umplanungsvorschlag ({rescheduleLessons.length})
              </h2>
              <div className="space-y-3">
                {rescheduleLessons.map(l => <LessonCard key={l.id} lesson={l} role="client" />)}
              </div>
            </section>
          )}

          {/* Ожидают подтверждения тьютором */}
          {pendingLessons.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                ⏳ Warte auf Bestätigung ({pendingLessons.length})
              </h2>
              <div className="space-y-3">
                {pendingLessons.map(l => <LessonCard key={l.id} lesson={l} role="client" />)}
              </div>
            </section>
          )}

          {/* Предстоящие */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {t('client.upcomingLessons.title')}
              </h2>
              <Link to="/lessons"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                {t('client.upcomingLessons.viewAll')}
              </Link>
            </div>
            {upcomingLessons.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200
                p-10 text-center">
                <p className="text-slate-500 text-sm mb-4">
                  {t('client.upcomingLessons.empty')}
                </p>
                <Link to="/tutors"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white
                    text-sm font-medium px-5 py-2.5 rounded-xl transition
                    shadow-lg shadow-orange-200">
                  {t('client.upcomingLessons.findBtn')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingLessons.slice(0, 5).map(l =>
                  <LessonCard key={l.id} lesson={l} role="client" />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const QuickAction = ({ to, icon, title, description }: {
  to: string; icon: string; title: string; description: string;
}) => (
  <Link to={to}
    className="bg-white rounded-3xl border border-slate-200 p-5
      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex items-start gap-4">
    <span className="text-2xl">{icon}</span>
    <div>
      <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
        {title}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  </Link>
);