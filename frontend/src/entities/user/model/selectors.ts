import type { RootState } from '@app/store';

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectActiveRole = (state: RootState) =>
  state.auth.activeRole || "gast";

export const selectUserId = (state: RootState) =>
  state.auth.userId;
