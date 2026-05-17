import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      localStorage.removeItem('guestMode');
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setGuestMode: (state) => {
      state.loading = false;
      state.isGuest = true;
      state.isAuthenticated = false;
      state.user = {
        displayName: 'Guest User',
        email: 'guest@weathersphere.com',
        role: 'guest'
      };
      localStorage.setItem('guestMode', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('guestMode');
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  setGuestMode, 
  logout,
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;