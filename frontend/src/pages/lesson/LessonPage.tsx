// Бывший LessonLive
import { useParams, Navigate } from 'react-router-dom';
import { useState }  from 'react';
import { useSelector } from 'react-redux';
import { useGetLessonQuery } from '@shared/api/lessonApi';
import { Spinner } from '@shared/index';
import { VideoRoom }      from '@widgets/lesson/VideoRoom';
import { LessonChat }     from '@widgets/lesson/LessonChat';
import { Whiteboard }     from '@widgets/lesson/Whiteboard';
import { LessonControls } from '@widgets/lesson/LessonControls';

type Tab = 'chat' | 'whiteboard';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data: lesson, isLoading } = useGetLessonQuery(
    lessonId ?? '',
    { skip: !lessonId },
  );

  // VideoRoom props
  const [localStream,   setLocalStream]   = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams]  = useState<Map<string, MediaStream>>(new Map());

  // Sidebar tab
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  if (!lessonId)   return <Navigate to="/dashboard" replace />;
  if (isLoading)   return <Spinner fullscreen />;
  if (!lesson)     return <Navigate to="/dashboard" replace />;

  const canJoin = lesson.status === 'confirmed' || lesson.status === 'in_progress';

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800
        border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            lesson.status === 'in_progress'
              ? 'bg-green-400 animate-pulse'
              : 'bg-yellow-400'
          }`} />
          <span className="text-sm font-medium">
            {lesson.status === 'in_progress' ? 'Unterricht läuft' : 'Warteraum'}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(lesson.scheduledAt).toLocaleString('de-DE')}
          {' · '}{lesson.durationMinutes} Min.
        </span>
      </div>

      {/* ── Main area ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video + Controls */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <VideoRoom
            lessonId={lessonId}
            localStream={localStream}
            setLocalStream={setLocalStream}
            remoteStreams={remoteStreams}
            setRemoteStreams={setRemoteStreams}
            canJoin={canJoin}
          />
          <LessonControls
            lessonId={lessonId}
            lesson={lesson}
            localStream={localStream}
          />
        </div>

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="w-80 flex flex-col border-l border-gray-700
          bg-gray-800 flex-shrink-0">

          {/* Tab switcher */}
          <div className="flex border-b border-gray-700 flex-shrink-0">
            {(['chat', 'whiteboard'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium transition
                  ${activeTab === tab
                    ? 'text-white border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-200'}`}
              >
                {tab === 'chat' ? '💬 Chat' : '🖊 Whiteboard'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat'
              ? <LessonChat lessonId={lessonId} />
              : <Whiteboard lessonId={lessonId} />
            }
          </div>
        </aside>

      </div>
    </div>
  );
}