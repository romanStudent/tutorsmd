import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { io, Socket } from 'socket.io-client';

import { tokenManager } from '@shared/lib/TokenManager';

interface Props {
  lessonId: string;
  children: React.ReactNode;
}

const LessonSocketContext =
  createContext<Socket | null>(null);

export const LessonSocketProvider = ({
  lessonId,
  children,
}: Props) => {
  const [socket, setSocket] =
    useState<Socket | null>(null);

  const [error, setError] = useState<string | undefined | null>("");
 

  useEffect(() => {
  const s = io(import.meta.env.VITE_SOCKET_URL as string, {
    withCredentials: true,
    auth: { token: tokenManager.get() },
  });

  s.on('connect', () => {
    s.emit('joinLesson', { lessonId }, (response: { ok: boolean; error?: string }) => {
      if (!response.ok) {
        setError(response.error ?? 'Failed to join lesson');
        console.log(error);
      } 
    });
  });

  setSocket(s);

  return () => {
    s.emit('lesson:leave', { lessonId });
    s.disconnect();
  };
}, [lessonId]);

  if (!socket) return null;

  return (
    <LessonSocketContext.Provider
      value={socket}
    >
      {children}
    </LessonSocketContext.Provider>
  );
};

export const useLessonSocket = () => {
  const socket =
    useContext(LessonSocketContext);

  if (!socket) {
    throw new Error(
      'LessonSocketProvider missing',
    );
  }

  return socket;
};