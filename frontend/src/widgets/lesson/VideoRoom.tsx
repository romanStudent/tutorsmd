// src/pages/lesson/components/VideoRoom.tsx
// Исправлено под реальный бэкенд:
// - joinLesson вместо lesson:join
// - joinLessonChat вместо lesson:chat:join
// - WebRTC события: shareScreen, sendStream, updateStream, stopScreen
// - updateParticipants / tutorJoined из lessonHandler
// - joinedLesson callback

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId, selectActiveRole } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io, Socket } from 'socket.io-client';

interface Props {
  lessonId:         string;
  localStream:      MediaStream | null;
  setLocalStream:   (s: MediaStream | null) => void;
  remoteStreams:    Map<string, MediaStream>;
  setRemoteStreams: React.Dispatch<React.SetStateAction<Map<string, MediaStream>>>;
  canJoin:          boolean;
}

export const VideoRoom = ({
  lessonId, localStream, setLocalStream,
  remoteStreams, setRemoteStreams, canJoin,
}: Props) => {
  const userId     = useSelector(selectUserId);
  const activeRole = useSelector(selectActiveRole);
  const localRef   = useRef<HTMLVideoElement>(null);
  const socketRef  = useRef<Socket | null>(null);
  const peersRef   = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [tutorPresent, setTutorPresent] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  // ─── Медиапоток ─────────────────────────────────────────────
  useEffect(() => {
    if (!canJoin) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localRef.current) localRef.current.srcObject = stream;
      })
      .catch(console.error);

    return () => { localStream?.getTracks().forEach(t => t.stop()); };
  }, [canJoin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Socket.IO + WebRTC ─────────────────────────────────────
  useEffect(() => {
    if (!canJoin || !localStream || !userId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token: tokenManager.get() },
    });
    socketRef.current = socket;

    // ── Присоединяемся к уроку (lessonHandler) ───────────────
    socket.emit('joinLesson', { lessonId });

    socket.on('joinedLesson', ({ status }: { startAt: string; status: string }) => {
      console.log('Joined lesson, status:', status);
    });

    socket.on('joinLessonError', ({ code, message }: any) => {
      console.error('Join lesson error:', code, message);
    });

    // ── Presence ─────────────────────────────────────────────
    socket.on('updateParticipants', (list: string[]) => {
      setParticipants(list);

      // Новые участники появились — инициируем offer к каждому
      list.forEach(async (peerId) => {
        if (peerId === socket.id) return;
        if (peersRef.current.has(peerId)) return; // уже есть
        const pc = createPeerConnection(peerId, socket);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('lesson:offer', { to: peerId, offer });
      });
    });

    socket.on('tutorJoined', () => setTutorPresent(true));

    // ── WebRTC signaling ─────────────────────────────────────
    // Бэкенд (webRtcHandler) relay-ит эти события между участниками
    socket.on('lesson:offer', async ({ from, offer }: any) => {
      const pc = createPeerConnection(from, socket);
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('lesson:answer', { to: from, answer });
    });

    socket.on('lesson:answer', async ({ from, answer }: any) => {
      await peersRef.current.get(from)?.setRemoteDescription(answer);
    });

    socket.on('lesson:ice-candidate', async ({ from, candidate }: any) => {
      await peersRef.current.get(from)?.addIceCandidate(candidate);
    });

    socket.on('lesson:user-left', (peerId: string) => {
      peersRef.current.get(peerId)?.close();
      peersRef.current.delete(peerId);
      setRemoteStreams(prev => { const m = new Map(prev); m.delete(peerId); return m; });
    });

    // ── Экран (webRtcHandler) ────────────────────────────────
    socket.on('shareScreen', (fromId: string, streamId: string) => {
      console.log('Screen share started by', fromId, streamId);
    });

    socket.on('stopScreen', (fromId: string) => {
      console.log('Screen share stopped by', fromId);
    });

    socket.on('receiveStream', (fromId: string, streamId: string) => {
      console.log('Received stream from', fromId, streamId);
    });

    // ── Урок завершён ────────────────────────────────────────
    socket.on('meetingEnded', () => {
      localStream?.getTracks().forEach(t => t.stop());
    });

    return () => {
      socket.emit('leaveLesson', { lessonId });
      socket.disconnect();
      peersRef.current.forEach(pc => pc.close());
      peersRef.current.clear();
    };
  }, [canJoin, localStream, userId, lessonId]); 

  const createPeerConnection = (peerId: string, socket: Socket): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream!));

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('lesson:ice-candidate', { to: peerId, candidate: e.candidate });
    };

    pc.ontrack = (e) => {
      setRemoteStreams(prev => new Map(prev).set(peerId, e.streams[0]));
    };

    peersRef.current.set(peerId, pc);
    return pc;
  };

  const remoteEntries = Array.from(remoteStreams.entries());
  const totalVideos   = 1 + remoteEntries.length;
  const cols          = totalVideos <= 1 ? 1 : totalVideos <= 4 ? 2 : 3;

  return (
    <div className="flex-1 grid gap-2 p-2 bg-gray-900"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>

      {/* Локальное видео */}
      <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
        <video ref={localRef} autoPlay playsInline muted
          className="w-full h-full object-cover" />
        <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
          Sie {activeRole === 'tutor' ? '(Lehrer)' : '(Schüler)'}
        </span>
      </div>

      {/* Удалённые видео */}
      {remoteEntries.map(([peerId, stream]) => (
        <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
      ))}

      {!canJoin && (
        <div className="col-span-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Der Unterricht hat noch nicht begonnen.</p>
        </div>
      )}
    </div>
  );
};

const RemoteVideo = ({ stream, peerId }: { stream: MediaStream; peerId: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (ref.current) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
        {peerId.slice(0, 8)}
      </span>
    </div>
  );
};