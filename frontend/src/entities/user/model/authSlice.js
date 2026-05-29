import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    userId: null,
    activeRole: null,
    isAuthenticated: false,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userId = action.payload.userId;
            state.activeRole = action.payload.activeRole;
            state.isAuthenticated = true;
        },
        clearCredentials: (state) => {
            state.userId = null;
            state.activeRole = null;
            state.isAuthenticated = false;
        },
        switchRole: (state, action) => {
            state.activeRole = action.payload;
        },
    },
});
export const { setCredentials, clearCredentials, switchRole } = authSlice.actions;
export const authReducer = authSlice.reducer;
