import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import {
  useConfirmLessonMutation,
  useRejectLessonMutation,
  useCancelByClientMutation,
  useCancelByTutorMutation,
  useAcceptRescheduleMutation,
  useDeclineRescheduleMutation,
  type Lesson,
} from '@shared/api/lessonApi';

const STATUS_LABELS: Record<string, string> = {
  pending:             'Anfrage',
  pending_reschedule:  'Umplanung',
  confirmed:           'Bestätigt',
  in_progress:         'Läuft',
  completed:           'Abgeschlossen',
  cancelled_by_client: 'Storniert (Schüler)',
  cancelled_by_tutor:  'Storniert (Lehrer)',
  rescheduled:         'Umgeplant',
  no_show_client:      'Nicht erschienen',
  no_show_tutor:       'Lehrer nicht erschienen',
};

const STATUS_COLORS: Record<string, string> = {
  pending:             'bg-yellow-100 text-yellow-700',
  pending_reschedule:  'bg-orange-100 text-orange-700',
  confirmed:           'bg-green-100 text-green-700',
  in_progress:         'bg-blue-100 text-blue-700',
  completed:           'bg-gray-100 text-gray-600',
  cancelled_by_client: 'bg-red-100 text-red-600',
  cancelled_by_tutor:  'bg-red-100 text-red-600',
  rescheduled:         'bg-purple-100 text-purple-600',
  no_show_client:      'bg-red-100 text-red-600',
  no_show_tutor:       'bg-red-100 text-red-600',
};

interface Props {
  lesson: Lesson;
  role:   'client' | 'tutor' | 'admin';
}

export const LessonCard = ({ lesson, role }: Props) => {
  const navigate    = useNavigate();
  const activeRole  = useSelector(selectActiveRole);
  const lessonId    = lesson.id;

  const [confirm]          = useConfirmLessonMutation();
  const [reject]           = useRejectLessonMutation();
  const [cancelByClient]   = useCancelByClientMutation();
  const [cancelByTutor]    = useCancelByTutorMutation();
  const [acceptReschedule] = useAcceptRescheduleMutation();
  const [declineReschedule]= useDeclineRescheduleMutation();

  const date   = new Date(lesson.scheduledAt);
  const person = role === 'client' ? lesson.tutor : lesson.client;
  const status = lesson.status;

  const stopPropagation = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const handleConfirm = stopPropagation(async () => {
    await confirm(lessonId).unwrap().catch(() => {});
  });

  const handleReject = stopPropagation(async () => {
    await reject(lessonId).unwrap().catch(() => {});
    navigate('/dashboard');
  });

  const handleCancel = stopPropagation(async () => {
    if (!window.confirm('Unterricht wirklich absagen?')) return;
    if (activeRole === 'client') await cancelByClient({ lessonId }).unwrap().catch(() => {});
    else                         await cancelByTutor({ lessonId }).unwrap().catch(() => {});
  });

  const handleAccept = stopPropagation(async () => {
    const result = await acceptReschedule(lessonId).unwrap().catch(() => null);
    if (result) navigate(`/lessons/${result.newLessonId}`);
  });

  const handleDecline = stopPropagation(async () => {
    await declineReschedule(lessonId).unwrap().catch(() => {});
  });

  return (
    <Link to={`/lessons/${lessonId}`}
      className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center
        justify-between gap-4 hover:shadow-md transition group">

      {/* Дата */}
      <div className="flex-shrink-0 w-14 text-center bg-gray-50 rounded-xl p-2">
        <p className="text-xs text-gray-400 uppercase">
          {date.toLocaleDateString('de-DE', { month: 'short' })}
        </p>
        <p className="text-xl font-bold text-gray-900 leading-none">{date.getDate()}</p>
        <p className="text-xs text-gray-500">
          {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Инфо */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600
          transition truncate">
          {person ? `${person.name} ${person.surname}` : '—'}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {lesson.durationMinutes} Min.
          {' · '}{lesson.type === 'trial' ? 'Probestunde' : 'Regulär'}
        </p>
        {/* Предложение о переносе */}
        {status === 'pending_reschedule' && lesson.proposedScheduledAt && (
          <p className="text-xs text-orange-600 mt-0.5">
            Vorschlag: {new Date(lesson.proposedScheduledAt).toLocaleString('de-DE')}
          </p>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">

        {/* pending: тьютор подтверждает/отклоняет */}
        {status === 'pending' && activeRole === 'tutor' && (
          <>
            <button onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white text-xs
                font-medium px-3 py-1.5 rounded-lg transition">
              ✓
            </button>
            <button onClick={handleReject}
              className="bg-red-100 hover:bg-red-200 text-red-600 text-xs
                font-medium px-3 py-1.5 rounded-lg transition">
              ✕
            </button>
          </>
        )}

        {/* pending: клиент отменяет */}
        {status === 'pending' && activeRole === 'client' && (
          <button onClick={handleCancel}
            className="bg-red-100 hover:bg-red-200 text-red-600 text-xs
              font-medium px-3 py-1.5 rounded-lg transition">
            Absagen
          </button>
        )}

        {/* confirmed: отмена */}
        {status === 'confirmed' && (
          <button onClick={handleCancel}
            className="bg-red-100 hover:bg-red-200 text-red-600 text-xs
              font-medium px-3 py-1.5 rounded-lg transition">
            Absagen
          </button>
        )}

        {/* pending_reschedule: клиент решает */}
        {status === 'pending_reschedule' && activeRole === 'client' && (
          <>
            <button onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700 text-white text-xs
                font-medium px-3 py-1.5 rounded-lg transition">
              ✓
            </button>
            <button onClick={handleDecline}
              className="bg-red-100 hover:bg-red-200 text-red-600 text-xs
                font-medium px-3 py-1.5 rounded-lg transition">
              ✕
            </button>
          </>
        )}

        {/* in_progress: войти */}
        {status === 'in_progress' && (
          <Link to={`/lessons/${lessonId}`}
            onClick={e => e.stopPropagation()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs
              font-medium px-3 py-1.5 rounded-lg transition">
            Beitreten
          </Link>
        )}

        {/* Статус */}
        <span className={`text-xs font-medium px-3 py-1 rounded-full
          ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>
    </Link>
  );
};