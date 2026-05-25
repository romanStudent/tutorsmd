export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<User, void>({
      query: () => '/profile/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApi;