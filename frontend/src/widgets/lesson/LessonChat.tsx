import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id:         string;
  senderId:   string;
  senderRole: string;
  text:       string | null;
  fileKey:    string | null;
  createdAt:  string;
}

export const LessonChat = ({ lessonId }: { lessonId: string }) => {
  const userId    = useSelector(selectUserId);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText]         = useState('');

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token: tokenManager.get() },
    });
    socketRef.current = socket;

    // joinLessonChat — отдельная чат-комната
    socket.emit('joinLessonChat', { lessonId });

    // История из Postgres (последние 50)
    socket.on('lessonChatHistory', (history: ChatMessage[]) => {
      setMessages(history);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    // Новое сообщение
    socket.on('newLessonMessage', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    return () => { socket.disconnect(); };
  }, [lessonId]);

  const send = () => {
    if (!text.trim()) return;
    // lessonMessage — имя события из lessonHandler
    socketRef.current?.emit('lessonMessage', { lessonId, text: text.trim() });
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.senderId === userId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm
                ${isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-700 text-gray-100 rounded-bl-sm'}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.fileKey && (
                  <a href={msg.fileKey} target="_blank" rel="noreferrer"
                    className="text-xs underline opacity-70 block mt-1">
                    📎 Datei
                  </a>
                )}
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
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Nachricht..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2
            text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={send} disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600
            text-white px-3 py-2 rounded-xl transition text-sm">
          ↑
        </button>
      </div>
    </div>
  );
};