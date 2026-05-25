
// Бывший LessonsLive
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { VideoRoom } from '@widgets/lesson/VideoRoom';
import { LessonChat } from '@widgets/lesson/LessonChat';
import { Whiteboard } from '@widgets/lesson/Whiteboard';
import { LessonControls } from '@widgets/lesson/LessonControls';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  // WebRTC state живёт локально — не нужен глобально
  const [localStream, setLocalStream]     = useState<MediaStream | null>(null);
  const [participants, setParticipants]   = useState<RTCPeerConnection[]>([]);

  if (!lessonId) return null;

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <VideoRoom
          lessonId={lessonId}
          localStream={localStream}
          setLocalStream={setLocalStream}
          participants={participants}
          setParticipants={setParticipants}
        />
        <LessonControls lessonId={lessonId} />
      </div>
      <aside className="w-80 flex flex-col border-l">
        <Whiteboard lessonId={lessonId} />
        <LessonChat lessonId={lessonId} />
      </aside>
    </div>
  );
}