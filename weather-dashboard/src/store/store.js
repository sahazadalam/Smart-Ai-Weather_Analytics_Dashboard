import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import weatherReducer from './weatherSlice';
import favoritesReducer from './favoritesSlice';
import tasksReducer from './tasksSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
    tasks: tasksReducer,
    admin: adminReducer,
  },
});