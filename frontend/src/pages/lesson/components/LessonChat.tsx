
// Чат через Socket.IO — сообщения не сохраняются в RTK Query кэш,

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io, Socket } from 'socket.io-client';

interface Message {
  senderId: string;
  text:     string;
  sentAt:   string;
}

export const LessonChat = ({ lessonId }: { lessonId: string }) => {
  const userId     = useSelector(selectUserId);
  const socketRef  = useRef<Socket | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText]         = useState('');

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token: tokenManager.get() },
    });
    socketRef.current = socket;

    socket.emit('lesson:chat:join', { lessonId });

    socket.on('lesson:chat:message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    return () => { socket.disconnect(); };
  }, [lessonId]);

  const send = () => {
    if (!text.trim()) return;
    socketRef.current?.emit('lesson:chat:send', { lessonId, text: text.trim() });
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => {
          const isOwn = msg.senderId === userId;
          return (
            <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm
                ${isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-700 text-gray-100 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Nachricht..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2
            text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600
            text-white px-3 py-2 rounded-xl transition text-sm"
        >
          ↑
        </button>
      </div>
    </div>
  );
};