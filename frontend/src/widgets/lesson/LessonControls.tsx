import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  localStream: MediaStream | null;
}

export const LessonControls = ({ localStream }: Props) => {
  const { t } = useTranslation('lesson');
  const navigate   = useNavigate();

  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach(t => { t.enabled = !mic; });
    setMic(v => !v);
  };

  const toggleCam = () => {
    localStream?.getVideoTracks().forEach(t => { t.enabled = !cam; });
    setCam(v => !v);
  };

  const handleLeave = () => {
    localStream?.getTracks().forEach(t => t.stop());
    navigate('/dashboard');
  };



  return (
    <div className="bg-slate-900 border-t border-slate-800 px-4 py-3
      flex items-center justify-center gap-3 flex-wrap">

      {/* Mic */}
      <ControlBtn
        onClick={toggleMic}
        active={mic}
        title={mic ? t('controls.micOff') : t('controls.micOn')}
        icon={mic ? '🎤' : '🔇'}
      />

      {/* Cam */}
      <ControlBtn
        onClick={toggleCam}
        active={cam}
        title={cam ? t('controls.camOff') : t('controls.camOn')}
        icon={cam ? '📷' : '🚫'}
      />

      {/* Leave */}
      <button
        onClick={handleLeave}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium
          px-4 py-2.5 rounded-xl transition"
      >
        {t('controls.leave')}
      </button>
    </div>
  );
};

// ─── Control button ───────────────────────────────────────────
const ControlBtn = ({
  onClick, active, title, icon,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  icon: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    className={`p-2.5 rounded-xl transition text-lg leading-none
      ${active
        ? 'bg-slate-700 hover:bg-slate-600'
        : 'bg-red-600 hover:bg-red-700'}`}
  >
    {icon}
  </button>
);