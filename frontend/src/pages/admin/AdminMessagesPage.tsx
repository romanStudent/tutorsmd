import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { useGetAllChatsQuery, useGetChatByIdQuery, type SupportMessage } from '@shared/api/supportApi';
import { Layout } from '@widgets/layout/ui/Layout';
import { Spinner } from '@shared/index';
import { io, Socket } from 'socket.io-client';

export default function AdminMessagesPage() {
  const userId = useSelector(selectUserId);
  const [chatId, setChatId] = useState<string | null>(null);

  const { data: allChatsResponse, isLoading: chatsLoading } = useGetAllChatsQuery();
  const { data: activeChat, isLoading: chatLoading } = useGetChatByIdQuery(chatId ?? '', { 
    skip: !chatId 
  });

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const chats = Array.isArray(allChatsResponse?.chats) ? allChatsResponse.chats : [];

  console.log('[Admin] allChatsResponse:', allChatsResponse);
  console.log('[Admin] activeChat:', activeChat);

  // Socket setup
  useEffect(() => {
    if (!chatId || !activeChat?.userId) {
      setIsJoined(false);
      setMessages([]);
      return;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      withCredentials: true,
      auth: { token: tokenManager.get() },
    });
    socketRef.current = socket;

    console.log(`[Admin] Joining chat ${chatId} with userId ${activeChat.userId}`);

    socket.emit('support:admin_join', { 
      targetUserId: activeChat.userId   // теперь точно UUID
    }, (res: any) => {
      console.log('ADMIN JOIN RESPONSE:', res);
      if (res?.ok) setIsJoined(true);
    });

    socket.on('support:history', (msgs: SupportMessage[]) => {
      console.log(`[Admin] Received history: ${msgs.length} messages`);
      setMessages(msgs);
    });

    socket.on('support:message', (msg: SupportMessage) => {
      setMessages(prev => [...prev, msg]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      socket.disconnect();
      setIsJoined(false);
      setMessages([]);
    };
  }, [chatId, activeChat?.userId]);

  const send = () => {
    if (!text.trim() || !socketRef.current || !isJoined) return;

    socketRef.current.emit('support:message', { text: text.trim() }, (res: any) => {
      if (res?.ok) setText('');
      else console.error('Admin send failed:', res);
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Support-Nachrichten</h1>

        <div className="flex gap-4 h-[calc(100vh-180px)]">
          <aside className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-y-auto">
            {chatsLoading ? (
              <Spinner />
            ) : chats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center p-6">Keine Chats</p>
            ) : (
              chats.map((chat: any) => (
                <button
                  key={chat.id}
                  onClick={() => setChatId(chat.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition
                    ${chatId === chat.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.user 
                      ? `${chat.user.name} ${chat.user.surname}` 
                      : chat.userId?.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {chat.user?.email ?? ''}
                  </p>
                </button>
              ))
            )}
          </aside>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden min-w-0">
            {!chatId ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Chat auswählen</p>
              </div>
            ) : chatLoading ? (
              <div className="flex-1 flex items-center justify-center"><Spinner /></div>
            ) : (
              <>
                <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                  <p className="font-medium text-gray-900">
                    {activeChat?.user 
                      ? `${activeChat.user.name} ${activeChat.user.surname}` 
                      : chatId}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">No messages yet</p>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.senderId === userId;
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                            ${isOwn ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                            {!isOwn && <p className="text-xs opacity-60 mb-1">{msg.senderRole}</p>}
                            {msg.text && <p>{msg.text}</p>}
                            <p className="text-xs mt-1 opacity-40 text-right">
                              {new Date(msg.createdAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder="Antwort schreiben..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={send}
                    disabled={!text.trim() || !isJoined}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl transition text-sm font-medium"
                  >
                    ↑
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}