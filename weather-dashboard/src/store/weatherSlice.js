import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '01c33699529ab0b7c6a829541065954d';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Indian cities only
export const DEFAULT_CITIES = [
  'Mumbai,IN', 'Delhi,IN', 'Bangalore,IN', 'Kolkata,IN',
  'Chennai,IN', 'Hyderabad,IN', 'Pune,IN', 'Ahmedabad,IN',
  'Surat,IN', 'Jaipur,IN', 'Lucknow,IN', 'Kanpur,IN',
  'Nagpur,IN', 'Indore,IN', 'Thane,IN', 'Bhopal,IN',
  'Visakhapatnam,IN', 'Patna,IN', 'Vadodara,IN', 'Ghaziabad,IN'
];

export const CITY_SUGGESTIONS = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 
  'Kolkata, West Bengal', 'Chennai, Tamil Nadu', 'Hyderabad, Telangana',
  'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Surat, Gujarat', 
  'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh', 'Visakhapatnam, Andhra Pradesh', 'Patna, Bihar'
];

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(`weather_${key}`);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    localStorage.removeItem(`weather_${key}`);
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
};

const setToCache = (key, data) => {
  try {
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(`weather_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (city, { rejectWithValue }) => {
    try {
      const cityName = city.split(',')[0].trim();
      const cacheKey = `current_${cityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return { ...cachedData, fromCache: true };
      }

      const response = await axios.get(
        `${BASE_URL}/weather?q=${cityName},IN&appid=${API_KEY}&units=metric`
      );
      setToCache(cacheKey, response.data);
      return { ...response.data, fromCache: false };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (city, { rejectWithValue }) => {
    try {
      const cityName = city.split(',')[0].trim();
      const cacheKey = `forecast_${cityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return { ...cachedData, fromCache: true };
      }

      const response = await axios.get(
        `${BASE_URL}/forecast?q=${cityName},IN&appid=${API_KEY}&units=metric`
      );
      setToCache(cacheKey, response.data);
      return { ...response.data, fromCache: false };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forecast data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: {},
    forecast: {},
    loading: false,
    error: null,
    unit: 'celsius',
    lastUpdated: {},
    autoRefresh: true,
  },
  reducers: {
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    forceRefresh: (state, action) => {
      const city = action.payload;
      if (city) {
        const cacheKey = `current_${city.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        localStorage.removeItem(`weather_${cacheKey}`);
      } else {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('weather_')) {
            localStorage.removeItem(key);
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.name) {
          const cityName = action.payload.name;
          state.current[cityName] = action.payload;
          state.lastUpdated[cityName] = Date.now();
        }
        state.error = null;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather data';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        if (action.payload && action.payload.city && action.payload.city.name) {
          const cityName = action.payload.city.name;
          state.forecast[cityName] = action.payload;
        }
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        console.error('Forecast fetch error:', action.payload);
      });
  },
});

export const { setUnit, clearError, setAutoRefresh, forceRefresh } = weatherSlice.actions;
export default weatherSlice.reducer;