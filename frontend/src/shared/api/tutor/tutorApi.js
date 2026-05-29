import { baseApi } from '../baseApi';
export const tutorApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET /tutor/profile — тьютор видит свой профиль
        getTutorProfile: build.query({
            query: () => '/tutor/profile',
            providesTags: ['Tutor'],
        }),
        // PUT /tutor/profile — тьютор обновляет профиль
        updateTutorProfile: build.mutation({
            query: (body) => ({
                url: '/tutor/profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Tutor'],
        }),
        // GET /tutor/pending — admin
        getPendingTutors: build.query({
            query: () => '/tutor/pending',
            providesTags: ['Tutor'],
        }),
        // POST /tutor/:tutorId/approve — admin
        approveTutor: build.mutation({
            query: ({ tutorId }) => ({
                url: `/tutor/${tutorId}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ['Tutor'],
        }),
        // POST /tutor/:tutorId/reject — admin
        rejectTutor: build.mutation({
            query: ({ tutorId, reason }) => ({
                url: `/tutor/${tutorId}/reject`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Tutor'],
        }),
    }),
});
export const { useGetTutorProfileQuery, useUpdateTutorProfileMutation, useGetPendingTutorsQuery, useApproveTutorMutation, useRejectTutorMutation, } = tutorApi;
