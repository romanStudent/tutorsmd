import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Admin видит все чаты — выбирает чат — отвечает
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@entities/user/model/selectors';
import { tokenManager } from '@shared/lib/TokenManager';
import { useGetAllChatsQuery, useGetChatByIdQuery, } from '@shared/api/supportApi';
import { Layout } from '@widgets/layout/ui/Layout';
import { Spinner } from '@shared/index';
import { io } from 'socket.io-client';
export default function AdminMessagesPage() {
    const userId = useSelector(selectUserId);
    const [chatId, setChatId] = useState(null);
    const { data: allChats, isLoading: chatsLoading } = useGetAllChatsQuery();
    const { data: activeChat, isLoading: chatLoading } = useGetChatByIdQuery(chatId ?? '', { skip: !chatId });
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    useEffect(() => {
        if (activeChat?.messages)
            setMessages(activeChat.messages);
    }, [activeChat]);
    useEffect(() => {
        if (!chatId)
            return;
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: { token: tokenManager.get() },
        });
        socketRef.current = socket;
        socket.emit('support:join', { chatId });
        socket.on('support:message', (msg) => {
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        });
        return () => { socket.disconnect(); };
    }, [chatId]);
    const send = () => {
        if (!text.trim() || !chatId)
            return;
        socketRef.current?.emit('support:send', { chatId, text: text.trim() });
        setText('');
    };
    const chats = allChats?.chats ?? [];
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Support-Nachrichten" }), _jsxs("div", { className: "flex gap-4 h-[calc(100vh-180px)]", children: [_jsx("aside", { className: "w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100\r\n            overflow-y-auto", children: chatsLoading ? (_jsx(Spinner, {})) : chats.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400 text-center p-6", children: "Keine Chats" })) : (chats.map((chat) => (_jsxs("button", { onClick: () => setChatId(chat.id), className: `w-full text-left px-4 py-3 border-b border-gray-50
                    hover:bg-gray-50 transition
                    ${chatId === chat.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`, children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: chat.user
                                            ? `${chat.user.name} ${chat.user.surname}`
                                            : chat.userId.slice(0, 8) }), _jsx("p", { className: "text-xs text-gray-400 truncate mt-0.5", children: chat.user?.email ?? '' }), chat.messages.at(-1)?.text && (_jsx("p", { className: "text-xs text-gray-500 truncate mt-1", children: chat.messages.at(-1).text }))] }, chat.id)))) }), _jsx("div", { className: "flex-1 flex flex-col bg-white rounded-2xl border border-gray-100\r\n            overflow-hidden min-w-0", children: !chatId ? (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx("p", { className: "text-gray-400 text-sm", children: "Chat ausw\u00E4hlen" }) })) : chatLoading ? (_jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsx(Spinner, {}) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "px-5 py-3 border-b border-gray-100 flex-shrink-0", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: activeChat?.user
                                                    ? `${activeChat.user.name} ${activeChat.user.surname}`
                                                    : chatId.slice(0, 8) }), _jsx("p", { className: "text-xs text-gray-400", children: activeChat?.user?.email })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3", children: [messages.map((msg) => {
                                                const isOwn = msg.senderId === userId;
                                                return (_jsx("div", { className: `flex ${isOwn ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[70%] px-4 py-2 rounded-2xl text-sm
                          ${isOwn
                                                            ? 'bg-blue-600 text-white rounded-br-sm'
                                                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`, children: [!isOwn && (_jsx("p", { className: "text-xs font-medium mb-1 opacity-60", children: msg.senderRole })), msg.text && _jsx("p", { children: msg.text }), _jsx("p", { className: "text-xs mt-1 opacity-40 text-right", children: new Date(msg.createdAt).toLocaleTimeString('de-DE', {
                                                                    hour: '2-digit', minute: '2-digit',
                                                                }) })] }) }, msg.id));
                                            }), _jsx("div", { ref: bottomRef })] }), _jsxs("div", { className: "px-4 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0", children: [_jsx("input", { value: text, onChange: (e) => setText(e.target.value), onKeyDown: (e) => e.key === 'Enter' && !e.shiftKey && send(), placeholder: "Antwort schreiben...", className: "flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm\r\n                      focus:outline-none focus:ring-2 focus:ring-blue-300" }), _jsx("button", { onClick: send, disabled: !text.trim(), className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300\r\n                      text-white px-4 py-2 rounded-xl transition text-sm font-medium", children: "\u2191" })] })] })) })] })] }) }));
}
