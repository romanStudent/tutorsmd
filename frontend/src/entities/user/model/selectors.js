export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectActiveRole = (state) => state.auth.activeRole || "gast";
export const selectUserId = (state) => state.auth.userId;
