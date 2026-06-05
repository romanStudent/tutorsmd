import { useGetUserProfileQuery } from '@shared/api/profileApi';
import { useGetTutorProfileQuery } from '@shared/api/tutor/tutorApi';
import { useGetUserLessonsQuery } from '@shared/api/lessonApi';
import { LessonCard } from '@widgets/lesson-card';
import { Spinner }    from '@shared/index';
import { Link }       from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const TutorDashboard = () => {
  const { t } = useTranslation('dashboard');

  const { data: profile }      = useGetUserProfileQuery();
  const { data: tutorProfile } = useGetTutorProfileQuery();
  const { data: lessonsData, isLoading } = useGetUserLessonsQuery({});

  const lessons = lessonsData?.lessons ?? [];

  const activeLessons   = lessons.filter(l => l.status === 'in_progress');
  const pendingLessons  = lessons.filter(l => l.status === 'pending');
  const upcomingLessons = lessons.filter(l => l.status === 'confirmed');

  const approvalStatus = tutorProfile?.approvalStatus;
  const isApproved     = approvalStatus === 'approved';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tutor.greeting', { name: profile?.name })}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ⭐ {tutorProfile?.ratingAvg?.toFixed(1) ?? '0.0'}
            <span className="text-slate-400 ml-1">({tutorProfile?.ratingCount ?? 0})</span>
          </p>
        </div>
        <ApprovalBadge status={approvalStatus} t={t} />
      </div>

      {/* Approval banners */}
      {approvalStatus === 'pending' && (
        <Banner color="amber"
          title={t('tutor.banners.pending.title')}
          subtitle={t('tutor.banners.pending.subtitle')} />
      )}
      {approvalStatus === 'submitted' && (
        <Banner color="blue"
          title="✓ Bewerbung eingereicht"
          subtitle="Wir prüfen Ihr Profil und melden uns bald." />
      )}
      {approvalStatus === 'under_review' && (
        <Banner color="amber"
          title="🔍 Profil wird geprüft"
          subtitle="Unser Team prüft Ihr Profil aktiv." />
      )}
      {approvalStatus === 'rejected' && (
        <Banner color="red"
          title={t('tutor.banners.rejected.title')}
          subtitle={tutorProfile?.rejectionReason ?? t('tutor.banners.rejected.subtitle')} />
      )}

      {/* Profile link — always visible */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5
        flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Lehrerprofil</p>
          <p className="text-xs text-slate-500 mt-0.5">Fächer, Beschreibung, Stundensatz</p>
        </div>
        <Link to="/settings?tab=tutor-profile"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs
            font-medium px-4 py-2 rounded-xl transition">
          Bearbeiten →
        </Link>
      </div>

      {isApproved && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickAction to="/lessons"        icon="📅" label={t('tutor.quickActions.lessons')} />
            <QuickAction to="/settings"       icon="📝" label={t('tutor.quickActions.profile')} />
            <QuickAction to="/settings/media" icon="🎥" label={t('tutor.quickActions.camera')} />
          </div>

          {isLoading ? <Spinner /> : (
            <>
              {activeLessons.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    🟢 {t('tutor.activeLessons.title')} ({activeLessons.length})
                  </h2>
                  <div className="space-y-3">
                    {activeLessons.map(l => <LessonCard key={l.id} lesson={l} role="tutor" />)}
                  </div>
                </section>
              )}

              {pendingLessons.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    ⏳ {t('tutor.pendingLessons.title')} ({pendingLessons.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingLessons.map(l => <LessonCard key={l.id} lesson={l} role="tutor" />)}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {t('tutor.upcomingLessons.title')}
                  </h2>
                  <Link to="/lessons"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                    {t('tutor.upcomingLessons.viewAll')}
                  </Link>
                </div>
                {upcomingLessons.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed
                    border-slate-200 p-10 text-center">
                    <p className="text-slate-500 text-sm">
                      {t('tutor.upcomingLessons.empty')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingLessons.slice(0, 5).map(l =>
                      <LessonCard key={l.id} lesson={l} role="tutor" />)}
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

const ApprovalBadge = ({ status, t }: { status?: string; t: any }) => {
  if (!status || status === 'approved') return null;
  const map: Record<string, { color: string; label: string }> = {
    pending:      { color: 'bg-amber-100 text-amber-700',  label: t('tutor.approvalStatus.pending') },
    submitted:    { color: 'bg-blue-100 text-blue-700',    label: 'Eingereicht' },
    under_review: { color: 'bg-purple-100 text-purple-700', label: 'In Prüfung' },
    rejected:     { color: 'bg-red-50 text-red-600',       label: t('tutor.approvalStatus.rejected') },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <span className={`self-start text-xs font-medium px-3 py-1.5 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const Banner = ({ color, title, subtitle }: {
  color: 'amber' | 'blue' | 'red';
  title: string;
  subtitle: string;
}) => {
  const cls = {
    amber: 'bg-amber-100 border-amber-200 text-amber-700',
    blue:  'bg-blue-50 border-blue-200 text-blue-700',
    red:   'bg-red-50 border-red-200 text-red-600',
  }[color];
  return (
    <div className={`border rounded-3xl p-5 ${cls}`}>
      <p className="text-sm font-semibold">{title}</p>
      {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
    </div>
  );
};

const QuickAction = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <Link to={to}
    className="bg-white rounded-3xl border border-slate-200 p-5
      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group">
    <span className="text-2xl">{icon}</span>
    <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
      {label}
    </p>
  </Link>
);