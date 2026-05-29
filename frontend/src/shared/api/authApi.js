import { baseApi } from './baseApi';
import { tokenManager } from '@shared/lib/TokenManager';
import { setCredentials, clearCredentials } from '@entities/user/model/authSlice';
export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // POST /auth/register/client
        registerClient: build.mutation({
            query: (body) => ({
                url: '/auth/register/client',
                method: 'POST',
                body,
            }),
        }),
        // POST /auth/register/tutor
        registerTutor: build.mutation({
            query: (body) => ({
                url: '/auth/register/tutor',
                method: 'POST',
                body,
            }),
        }),
        // POST /auth/login
        login: build.mutation({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    tokenManager.set(data.accessToken);
                    dispatch(setCredentials({
                        userId: data.user.id,
                        activeRole: data.user.activeRole,
                    }));
                }
                catch {
                    // ошибка обрабатывается в компоненте
                }
            },
        }),
        // POST /auth/logout
        logout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                }
                finally {
                    // Разлогиниваем в любом случае
                    tokenManager.clear();
                    dispatch(clearCredentials());
                }
            },
        }),
        // POST /auth/refresh — вызывается при старте приложения
        refresh: build.mutation({
            query: (body) => ({
                url: '/auth/refresh',
                method: 'POST',
                body,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    tokenManager.set(data.accessToken);
                }
                catch {
                    tokenManager.clear();
                    dispatch(clearCredentials());
                }
            },
        }),
        // POST /auth/forgot-password
        forgotPassword: build.mutation({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        // POST /auth/reset-password/:token
        resetPassword: build.mutation({
            query: ({ token, newPassword }) => ({
                url: `/auth/reset-password/${token}`,
                method: 'POST',
                body: { newPassword },
            }),
        }),
        // PUT /auth/change-password
        changePassword: build.mutation({
            query: (body) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body,
            }),
        }),
        // POST /auth/switch-role
        switchRole: build.mutation({
            query: (body) => ({
                url: '/auth/switch-role',
                method: 'POST',
                body,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    tokenManager.set(data.accessToken);
                    dispatch(setCredentials({
                        userId: _arg.newRole, // userId не меняется — обновим только роль
                        activeRole: _arg.newRole,
                    }));
                }
                catch { }
            },
        }),
        // POST /auth/activate/:token
        activateAccount: build.mutation({
            query: ({ token }) => ({
                url: `/auth/activate/${token}`,
                method: 'POST',
            }),
        }),
        // POST /auth/resend-verification
        resendVerification: build.mutation({
            query: (email) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                body: { email },
            }),
        }),
        requestEmailChange: build.mutation({
            query: (body) => ({
                url: '/auth/email/change',
                method: 'POST',
                body
            }),
        }),
        // GET /auth/sessions
        getSessions: build.query({
            query: () => '/auth/sessions',
            providesTags: ['Session'],
        }),
        // DELETE /auth/sessions
        revokeAllSessions: build.mutation({
            query: () => ({
                url: '/auth/sessions',
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),
        // DELETE /auth/sessions/:tokenHash
        revokeSession: build.mutation({
            query: ({ tokenHash }) => ({
                url: `/auth/sessions/${tokenHash}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),
    }),
});
export const { useRegisterClientMutation, useRegisterTutorMutation, useLoginMutation, useLogoutMutation, useRefreshMutation, useForgotPasswordMutation, useResetPasswordMutation, useChangePasswordMutation, useRequestEmailChangeMutation, useSwitchRoleMutation, useActivateAccountMutation, useGetSessionsQuery, useRevokeAllSessionsMutation, useRevokeSessionMutation, useResendVerificationMutation } = authApi;
