
import { useParams, Link } from 'react-router-dom';
import { useGetTutorByIdQuery, useGetTutorSlotsQuery } from '@shared/api/tutor/tutorPublicApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectActiveRole } from '@entities/user/model/selectors';
import { Layout } from '@widgets/layout/ui/Layout';
import { Spinner } from '@shared/index';
import { BookTrialButton } from './components/BookTrialButton';
import { TutorSchedule }  from './components/TutorSchedule';


export default function TutorPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole = useSelector(selectActiveRole);

  const { data: tutor, isLoading } = useGetTutorByIdQuery(tutorId ?? '', { skip: !tutorId });
  const { data: slotsData }        = useGetTutorSlotsQuery(tutorId ?? '', { skip: !tutorId });

  if (isLoading) return <Layout><Spinner /></Layout>;
  if (!tutor)    return <Layout><div className="text-center py-12 text-gray-400">Nicht gefunden.</div></Layout>;

  const slots = slotsData?.slots ?? [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6">
          <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center
            text-blue-600 font-bold text-3xl flex-shrink-0">
            {tutor.avatarUrl
              ? <img src={tutor.avatarUrl} alt="" className="w-24 h-24 rounded-2xl object-cover" />
              : `${tutor.name[0]}${tutor.surname[0]}`}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {tutor.name} {tutor.surname}
            </h1>
            {tutor.nameDe && (
              <p className="text-sm text-gray-400">{tutor.nameDe} {tutor.surnameDe}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">
                ⭐ {tutor.ratingAvg.toFixed(1)} ({tutor.ratingCount} Bewertungen)
              </span>
              {tutor.hourlyRate && (
                <span className="text-sm font-semibold text-gray-900">
                  {tutor.hourlyRate} €/Std.
                </span>
              )}
            </div>
            {tutor.highlightDe && (
              <p className="text-sm text-gray-600 mt-3">{tutor.highlightDe}</p>
            )}
          </div>
        </div>

        {/* Beschreibung */}
        {tutor.fulldescribeDe && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Über mich</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{tutor.fulldescribeDe}</p>
          </div>
        )}

        {/* Расписание */}
        <TutorSchedule slots={slots} />

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Probestunde buchen</h2>
          <p className="text-blue-100 text-sm mb-4">
            Erste Stunde — lernen Sie den Lehrer kennen.
          </p>
          {isAuthenticated && activeRole === 'client' ? (
            <BookTrialButton tutorId={tutor.id} />
          ) : !isAuthenticated ? (
            <Link to="/login"
              className="inline-block bg-white text-blue-600 font-medium text-sm
                px-6 py-2 rounded-lg hover:bg-blue-50 transition">
              Anmelden zum Buchen
            </Link>
          ) : (
            <p className="text-blue-200 text-sm">
              Nur Schüler können Unterricht buchen.
            </p>
          )}
        </div>

      </div>
    </Layout>
  );
}