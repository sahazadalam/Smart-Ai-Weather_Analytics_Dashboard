import { createSlice } from '@reduxjs/toolkit';

const ADMIN_CREDENTIALS = {
  email: 'faisal@gmail.com',
  password: 'Faisal@123'
};

const initialState = {
  isAdmin: false,
  users: JSON.parse(localStorage.getItem('registeredUsers') || '[]'),
  weatherAlerts: [],
  systemSettings: {
    autoRefresh: true,
    refreshInterval: 30000,
    enableNotifications: true,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLogin: (state, action) => {
      const { email, password } = action.payload;
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        state.isAdmin = true;
        localStorage.setItem('adminSession', 'true');
        return true;
      }
      return false;
    },
    adminLogout: (state) => {
      state.isAdmin = false;
      localStorage.removeItem('adminSession');
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
      localStorage.setItem('registeredUsers', JSON.stringify(state.users));
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      localStorage.setItem('registeredUsers', JSON.stringify(state.users));
    },
    addWeatherAlert: (state, action) => {
      state.weatherAlerts.push({
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    removeWeatherAlert: (state, action) => {
      state.weatherAlerts = state.weatherAlerts.filter(alert => alert.id !== action.payload);
    },
    updateSystemSettings: (state, action) => {
      state.systemSettings = { ...state.systemSettings, ...action.payload };
    },
  },
});

export const {
  adminLogin,
  adminLogout,
  addUser,
  removeUser,
  addWeatherAlert,
  removeWeatherAlert,
  updateSystemSettings,
} = adminSlice.actions;

export default adminSlice.reducer;