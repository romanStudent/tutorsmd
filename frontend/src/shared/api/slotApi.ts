import { baseApi } from './baseApi';

export interface Slot {
  id:        string;
  dayOfWeek: number;
  startTime: string;
  endTime:   string;
  isActive:  boolean;
}

export const slotApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /slots/my — слоты текущего тьютора
    getTutorSlots: build.query<{ slots: Slot[] }, void>({
      query: () => '/slots/my',
      providesTags: ['Slot'],
    }),

    // POST /slots
    createSlot: build.mutation<Slot, { dayOfWeek: number; startTime: string; endTime: string }>({
      query: (body) => ({ url: '/slots', method: 'POST', body }),
      invalidatesTags: ['Slot'],
    }),

    // DELETE /slots/:slotId
    deleteSlot: build.mutation<void, string>({
      query: (id) => ({ url: `/slots/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Slot'],
    }),
  }),
});

export const {
  useGetTutorSlotsQuery,
  useCreateSlotMutation,
  useDeleteSlotMutation,
} = slotApi;