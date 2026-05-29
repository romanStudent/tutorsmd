// Публичные tutor endpoints 
import { baseApi } from '../baseApi';
export const tutorPublicApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET /tutors
        getTutors: build.query({
            query: (params) => ({ url: '/tutors', params }),
            providesTags: ['Tutor'],
        }),
        // GET /tutors/:tutorId
        getTutorById: build.query({
            query: (id) => `/tutors/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Tutor', id }],
        }),
        // GET /slots/tutor/:tutorId
        getTutorSlots: build.query({
            query: (tutorId) => `/slots/tutor/${tutorId}`,
            providesTags: ['Slot'],
        }),
    }),
});
export const { useGetTutorsQuery, useGetTutorByIdQuery, useGetTutorSlotsQuery, } = tutorPublicApi;
