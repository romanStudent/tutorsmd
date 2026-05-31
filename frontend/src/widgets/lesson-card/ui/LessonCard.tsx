import { Link, useNavigate } from 'react-router-dom';
import { useCancelByClientMutation, useCancelByTutorMutation, useConfirmLessonMutation, type Lesson } from '@shared/api/lessonApi';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';

const STATUS_LABELS: Record<string, string> = {
  pending:              'Anfrage',
  pending_reschedule:   'Umplanung',
  confirmed:            'Bestätigt',
  in_progress:          'Läuft',
  completed:            'Abgeschlossen',
  cancelled_by_client:  'Storniert (Schüler)',
  cancelled_by_tutor:   'Storniert (Lehrer)',
  no_show_client:       'Nicht erschienen',
  no_show_tutor:        'Lehrer nicht erschienen',
};

const STATUS_COLORS: Record<string, string> = {
  pending:             'bg-yellow-100 text-yellow-700',
  pending_reschedule:  'bg-orange-100 text-orange-700',
  confirmed:           'bg-green-100 text-green-700',
  in_progress:         'bg-blue-100 text-blue-700',
  completed:           'bg-gray-100 text-gray-600',
  cancelled_by_client: 'bg-red-100 text-red-600',
  cancelled_by_tutor:  'bg-red-100 text-red-600',
  no_show_client:      'bg-red-100 text-red-600',
  no_show_tutor:       'bg-red-100 text-red-600',
};

interface Props {
  lesson: Lesson;
  role:   'client' | 'tutor' | 'admin';
}

export const LessonCard = ({ lesson, role }: Props) => {

  const navigate    = useNavigate();
  const date = new Date(lesson.scheduledAt);
  const person = role === 'client' ? lesson.tutor : lesson.client;

    const activeRole  = useSelector(selectActiveRole);
    const lessonId = lesson.id;
  
    const [confirmLesson]  = useConfirmLessonMutation();
    const [cancelByClient] = useCancelByClientMutation();
    const [cancelByTutor]  = useCancelByTutorMutation();
  

    const handleCancel = async () => {
    if (!confirm('Unterricht wirklich absagen?')) return;
    if (activeRole === 'client') {
      await cancelByClient({ lessonId }).unwrap().catch(() => {});
    } else {
      await cancelByTutor({ lessonId }).unwrap().catch(() => {});
    }
    navigate('/dashboard');
  };

  return (
    <Link
      to={`/lessons/${lesson.id}`}
      className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center
        justify-between gap-4 hover:shadow-md transition group"
    >
      <div className="flex items-center gap-4">

        {/* Дата */}
        <div className="flex-shrink-0 w-14 text-center bg-gray-50 rounded-xl p-2">
          <p className="text-xs text-gray-400 uppercase">
            {date.toLocaleDateString('de-DE', { month: 'short' })}
          </p>
          <p className="text-xl font-bold text-gray-900 leading-none">
            {date.getDate()}
          </p>
          <p className="text-xs text-gray-500">
            {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Инфо */}
        <div>
          <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition">
            {person ? `${person.name} ${person.surname}` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {lesson.durationMinutes} Min. · {lesson.type === 'trial' ? 'Probestunde' : 'Regulär'}
          </p>
        </div>
      </div>

         {/* Подтвердить урок (тьютор, статус pending) */}
      {activeRole === 'tutor' && lesson.status === 'pending' && (
        <button onClick={() => confirmLesson(lessonId)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium
            px-4 py-2 rounded-xl transition">
          Bestätigen
        </button>
      )}

      {/* Отменить */}
      {['pending', 'confirmed'].includes(lesson.status) && (
        <button onClick={handleCancel}
          className="bg-gray-700 hover:bg-red-700 text-white text-sm font-medium
            px-4 py-2 rounded-xl transition">
          Absagen
        </button>
      )}

      {/* Статус */}
      <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0
        ${STATUS_COLORS[lesson.status] ?? 'bg-gray-100 text-gray-600'}`}>
        {STATUS_LABELS[lesson.status] ?? lesson.status}
      </span>
    </Link>
  );
};