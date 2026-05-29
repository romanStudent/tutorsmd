// src/shared/api/lessonApi.ts
import { baseApi } from './baseApi';
export const lessonApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET /lessons/:lessonId
        getLesson: build.query({
            query: (id) => `/lessons/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Lesson', id }],
        }),
        // GET /lessons — список уроков текущего пользователя
        getUserLessons: build.query({
            query: (params) => ({ url: '/lessons', params }),
            providesTags: ['Lesson'],
        }),
        // POST /lessons/trial
        createTrialLesson: build.mutation({
            query: (body) => ({ url: '/lessons/trial', method: 'POST', body }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/confirm
        confirmLesson: build.mutation({
            query: (id) => ({ url: `/lessons/${id}/confirm`, method: 'POST' }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/cancel/client
        cancelByClient: build.mutation({
            query: ({ lessonId, reason }) => ({
                url: `/lessons/${lessonId}/cancel/client`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/cancel/tutor
        cancelByTutor: build.mutation({
            query: ({ lessonId, reason }) => ({
                url: `/lessons/${lessonId}/cancel/tutor`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/reschedule/propose
        proposeReschedule: build.mutation({
            query: ({ lessonId, ...body }) => ({
                url: `/lessons/${lessonId}/reschedule/propose`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/reschedule/accept
        acceptReschedule: build.mutation({
            query: (id) => ({ url: `/lessons/${id}/reschedule/accept`, method: 'POST' }),
            invalidatesTags: ['Lesson'],
        }),
        // POST /lessons/:lessonId/reschedule/decline
        declineReschedule: build.mutation({
            query: (id) => ({ url: `/lessons/${id}/reschedule/decline`, method: 'POST' }),
            invalidatesTags: ['Lesson'],
        }),
    }),
});
export const { useGetLessonQuery, useGetUserLessonsQuery, useCreateTrialLessonMutation, useConfirmLessonMutation, useCancelByClientMutation, useCancelByTutorMutation, useProposeRescheduleMutation, useAcceptRescheduleMutation, useDeclineRescheduleMutation, } = lessonApi;
