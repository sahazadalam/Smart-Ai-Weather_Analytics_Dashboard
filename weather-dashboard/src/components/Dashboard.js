import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

import {
  fetchCurrentWeather,
  fetchForecast,
  DEFAULT_CITIES,
  setUnit,
  clearError,
  forceRefresh
} from '../store/weatherSlice';

import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { logout } from '../store/authSlice';

import WeatherCard from './WeatherCard';
import SearchBar from './SearchBar';
import WeatherModal from './WeatherModal';
import UserProfile from './UserProfile';
import Recommendations from './Recommendations';
import WeatherChatbot from './WeatherChatbot';
import TaskPlanner from './TaskPlanner';

import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    current,
    loading,
    error,
    unit,
    autoRefresh
  } = useSelector(state => state.weather);

  const favorites = useSelector(state => state.favorites.cities);
  const { user } = useSelector(state => state.auth);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityData, setSelectedCityData] = useState(null);
  const [activeView, setActiveView] = useState('all');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showRecommendations] = useState(true);

  useEffect(() => {
    const citiesToLoad = [...DEFAULT_CITIES, ...favorites];
    const uniqueCities = [...new Set(citiesToLoad)];

    uniqueCities.forEach(city => {
      dispatch(fetchCurrentWeather(city));
      dispatch(fetchForecast(city));
    });
  }, [dispatch, favorites]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const citiesToRefresh = [...DEFAULT_CITIES, ...favorites];
      const uniqueCities = [...new Set(citiesToRefresh)];

      uniqueCities.forEach(city => {
        dispatch(forceRefresh(city));
        dispatch(fetchCurrentWeather(city));
      });
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch, autoRefresh, favorites]);

  const handleCardClick = (cityName) => {
    const cityData = current[cityName];
    setSelectedCity(cityName);
    setSelectedCityData(cityData);
  };

  const handleCloseModal = () => {
    setSelectedCity(null);
    setSelectedCityData(null);
  };

  const handleUnitToggle = () => {
    dispatch(
      setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredWeatherData = Object.values(current).filter(data => {
    if (activeView === 'favorites') {
      return favorites.includes(data.name);
    }

    return true;
  });

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div className="header-content">

          <div className="header-left">
            <div className="logo">🌤️</div>

            <div className="header-titles">
              <h1>WeatherSphere</h1>
              <p>India Weather Analytics</p>
            </div>
          </div>

          <div className="header-center">
            <SearchBar />
          </div>

          <div className="header-right">

            <div className="view-controls">

              <button
                className={`view-btn ${activeView === 'all' ? 'active' : ''}`}
                onClick={() => setActiveView('all')}
              >
                All Cities
              </button>

              <button
                className={`view-btn ${activeView === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveView('favorites')}
              >
                ★ Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>

            </div>

            <div className="utility-controls">

              {/* Task Planner */}
              <TaskPlanner />

              <button
                onClick={handleUnitToggle}
                className="unit-btn"
                title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              >
                °{unit === 'celsius' ? 'C' : 'F'}
              </button>

              <button
                onClick={() => {
                  dispatch(forceRefresh());

                  const citiesToRefresh = [
                    ...DEFAULT_CITIES,
                    ...favorites
                  ];

                  const uniqueCities = [...new Set(citiesToRefresh)];

                  uniqueCities.forEach(city =>
                    dispatch(fetchCurrentWeather(city))
                  );
                }}
                className="refresh-btn"
                disabled={loading}
              >
                {loading ? '⟳' : '↻'}
              </button>

              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="chatbot-toggle"
              >
                🤖
              </button>

            </div>

            <UserProfile onLogout={handleLogout} />

          </div>

        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>

          <button onClick={() => dispatch(clearError())}>
            ×
          </button>
        </div>
      )}

      <div className="dashboard-main">

        {showRecommendations && selectedCityData && (
          <Recommendations weatherData={selectedCityData} />
        )}

        <div className="cities-section">

          <h2>
            {activeView === 'all'
              ? 'All Cities'
              : 'Your Favorite Cities'}

            <span className="city-count">
              {filteredWeatherData.length} cities
            </span>
          </h2>

          <div className="cities-grid">

            {filteredWeatherData.map((data) => (
              <WeatherCard
                key={data.name}
                weatherData={data}
                onCardClick={handleCardClick}
              />
            ))}

          </div>

          {filteredWeatherData.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">🏙️</div>

              <h3>No cities to display</h3>

              <p>
                {activeView === 'favorites'
                  ? 'Add cities to your favorites to see them here.'
                  : 'Search for Indian cities to add them to your dashboard.'
                }
              </p>

            </div>
          )}

        </div>
      </div>

      {selectedCity && selectedCityData && (
        <WeatherModal
          cityName={selectedCity}
          onClose={handleCloseModal}
        />
      )}

      {showChatbot && (
        <WeatherChatbot
          onClose={() => setShowChatbot(false)}
          weatherData={current}
        />
      )}

      <footer className="dashboard-footer">

        <div className="footer-content">

          <p>
            © 2026 WeatherSphere | Real-time Weather Analytics for India
          </p>

          <div className="footer-info">

            <span>
              Auto-refresh: {autoRefresh ? 'ON (5 min)' : 'OFF'}
            </span>

            <span>
              • Unit: {unit === 'celsius' ? '°C' : '°F'}
            </span>

            <span>
              • Welcome, {user?.displayName || 'User'}!
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Dashboard;