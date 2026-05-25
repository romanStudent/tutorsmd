import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Role } from './types';

interface AuthState {
  userId:          string | null;
  activeRole:      Role | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId:          null,
  activeRole:      null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ userId: string; activeRole: Role }>,
    ) => {
      state.userId          = action.payload.userId;
      state.activeRole      = action.payload.activeRole;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.userId          = null;
      state.activeRole      = null;
      state.isAuthenticated = false;
    },
    switchRole: (state, action: PayloadAction<Role>) => {
      state.activeRole = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, switchRole } = authSlice.actions;
export const authReducer = authSlice.reducer;