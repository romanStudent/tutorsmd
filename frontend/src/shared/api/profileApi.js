import { baseApi } from './baseApi';
export const profileApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // GET /profile/me
        getUserProfile: build.query({
            query: () => '/profile/me',
            providesTags: ['User'],
        }),
        // PUT /profile/me
        updateUserProfile: build.mutation({
            query: (body) => ({
                url: '/profile/me',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});
export const { useGetUserProfileQuery, useUpdateUserProfileMutation, } = profileApi;
