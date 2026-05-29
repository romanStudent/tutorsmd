import { baseApi } from './baseApi';
export const supportApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET /support/chat — текущий юзер получает свой чат (создаётся автоматически)
        getMyChat: build.query({
            query: () => '/support/chat',
            providesTags: ['Support'],
        }),
        // GET /support/chats — admin: список всех чатов
        getAllChats: build.query({
            query: () => '/support/chats',
            providesTags: ['Support'],
        }),
        // GET /support/chats/:chatId — admin: конкретный чат
        getChatById: build.query({
            query: (chatId) => `/support/chats/${chatId}`,
            providesTags: (_r, _e, id) => [{ type: 'Support', id }],
        }),
    }),
});
export const { useGetMyChatQuery, useGetAllChatsQuery, useGetChatByIdQuery, } = supportApi;
