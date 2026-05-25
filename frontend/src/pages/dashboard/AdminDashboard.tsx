import { useGetPendingTutorsQuery, useApproveTutorMutation, useRejectTutorMutation } from '@shared/api/tutorApi';
import { Spinner } from '@shared/ui/index';

export const AdminDashboard = () => {
  const { data, isLoading } = useGetPendingTutorsQuery();
  const [approve, { isLoading: approving }] = useApproveTutorMutation();
  const [reject,  { isLoading: rejecting }] = useRejectTutorMutation();

  const pending = data?.tutors ?? [];

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold text-gray-900">Admin-Bereich</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Nachhilfelehrer zur Prüfung ({pending.length})
        </h2>

        {isLoading ? (
          <Spinner />
        ) : pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">Keine ausstehenden Anträge.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((tutor) => (
              <div
                key={tutor.tutorId}
                className="bg-white rounded-2xl border border-gray-100 p-5
                  flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {tutor.name} {tutor.surname}
                  </p>
                  <p className="text-sm text-gray-500">{tutor.email}</p>
                  {tutor.nameDe && (
                    <p className="text-xs text-gray-400 mt-0.5">DE: {tutor.nameDe}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve({ tutorId: tutor.tutorId })}
                    disabled={approving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400
                      text-white text-sm px-4 py-2 rounded-lg transition"
                  >
                    Freischalten
                  </button>
                  <button
                    onClick={() => reject({ tutorId: tutor.tutorId })}
                    disabled={rejecting}
                    className="bg-red-100 hover:bg-red-200 text-red-700
                      text-sm px-4 py-2 rounded-lg transition"
                  >
                    Ablehnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};