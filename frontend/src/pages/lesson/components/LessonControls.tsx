
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveRole } from '@entities/user/model/selectors';
import {
  useConfirmLessonMutation,
  useCancelByClientMutation,
  useCancelByTutorMutation,
} from '@shared/api/lessonApi';
import type { Lesson } from '@shared/api/lessonApi';

interface Props {
  lessonId:    string;
  lesson:      Lesson;
  localStream: MediaStream | null;
}

export const LessonControls = ({ lessonId, lesson, localStream }: Props) => {
  const navigate    = useNavigate();
  const activeRole  = useSelector(selectActiveRole);
  const [mic, setMic]   = useState(true);
  const [cam, setCam]   = useState(true);

  const [confirmLesson]  = useConfirmLessonMutation();
  const [cancelByClient] = useCancelByClientMutation();
  const [cancelByTutor]  = useCancelByTutorMutation();

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach(t => { t.enabled = !mic; });
    setMic(v => !v);
  };

  const toggleCam = () => {
    localStream?.getVideoTracks().forEach(t => { t.enabled = !cam; });
    setCam(v => !v);
  };

  const handleLeave = async () => {
    localStream?.getTracks().forEach(t => t.stop());
    navigate('/dashboard');
  };

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
    <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-center gap-4">

      {/* Микрофон */}
      <button onClick={toggleMic}
        className={`p-3 rounded-xl transition ${mic ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        title={mic ? 'Mikrofon ausschalten' : 'Mikrofon einschalten'}>
        {mic ? '🎤' : '🔇'}
      </button>

      {/* Камера */}
      <button onClick={toggleCam}
        className={`p-3 rounded-xl transition ${cam ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
        title={cam ? 'Kamera ausschalten' : 'Kamera einschalten'}>
        {cam ? '📷' : '🚫'}
      </button>

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

      {/* Выйти */}
      <button onClick={handleLeave}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium
          px-4 py-2 rounded-xl transition">
        Verlassen
      </button>
    </div>
  );
};