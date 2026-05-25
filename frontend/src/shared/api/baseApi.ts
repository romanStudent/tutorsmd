import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { tokenManager } from '@shared/lib/tokenManager';
import { setCredentials, clearCredentials } from '@entities/user/model/authSlice';
import type { RootState } from '@app/store';

// Базовый запрос с accessToken из памяти
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',          
  prepareHeaders: (headers) => {
    const token = tokenManager.get();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// refresh при 401
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Пробуем обновить токен
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { activeRole: (api.getState() as RootState).auth.activeRole },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken: string };
      tokenManager.set(data.accessToken);

      // Повторяем исходный запрос
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh тоже провалился — разлогиниваем
      tokenManager.clear();
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Tutor', 'Lesson', 'Review', 'Slot', 'Quiz', 'Appeal'],
  endpoints: () => ({}),
});