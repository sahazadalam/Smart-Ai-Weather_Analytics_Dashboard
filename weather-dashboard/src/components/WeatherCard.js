import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import './WeatherCard.css';

const WeatherCard = ({ weatherData, onCardClick }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.cities);
  const { unit } = useSelector(state => state.weather);
  
  const isFavorite = favorites.includes(weatherData.name);
  
  const getTemperature = (kelvinTemp) => {
    if (unit === 'celsius') {
      return `${Math.round(kelvinTemp)}°C`;
    }
    return `${Math.round((kelvinTemp * 9/5) + 32)}°F`;
  };
  
  const getWeatherIcon = (condition) => {
    const icons = {
      'clear': '☀️',
      'clouds': '☁️',
      'rain': '🌧️',
      'drizzle': '🌦️',
      'thunderstorm': '⛈️',
      'snow': '❄️',
      'mist': '🌫️',
      'smoke': '💨',
      'haze': '🌁',
      'dust': '💨',
      'fog': '🌫️'
    };
    return icons[condition.toLowerCase()] || '🌡️';
  };
  
  const getBackgroundGradient = (temp, condition) => {
    if (condition.toLowerCase().includes('rain')) {
      return 'linear-gradient(135deg, #2c3e50, #3498db)';
    }
    if (temp > 35) {
      return 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
    if (temp < 10) {
      return 'linear-gradient(135deg, #34495e, #2c3e50)';
    }
    if (condition.toLowerCase().includes('cloud')) {
      return 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    }
    return 'linear-gradient(135deg, #4facfe, #00f2fe)';
  };
  
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main;
  const backgroundColor = getBackgroundGradient(temp, condition);
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(weatherData.name));
    } else {
      dispatch(addFavorite(weatherData.name));
    }
  };
  
  const handleCardClick = () => {
    onCardClick(weatherData.name);
  };
  
  return (
    <div 
      className="weather-card"
      style={{ background: backgroundColor }}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <div className="city-info">
          <h3 className="city-name">{weatherData.name}</h3>
          <p className="country">{weatherData.sys.country}</p>
        </div>
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      
      <div className="weather-main">
        <div className="weather-icon-large">
          {getWeatherIcon(condition)}
        </div>
        <div className="temperature">
          {getTemperature(temp)}
        </div>
        <div className="weather-condition">
          {weatherData.weather[0].description}
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weatherData.main.humidity}%</span>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{Math.round(weatherData.wind.speed)} km/h</span>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📊</span>
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{weatherData.main.pressure} hPa</span>
          </div>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👁️</span>
          <div className="detail-info">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{(weatherData.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <span className="update-time">
          Updated: {new Date(weatherData.dt * 1000).toLocaleTimeString()}
        </span>
        {weatherData.fromCache && <span className="cached-badge">Cached</span>}
      </div>
    </div>
  );
};

export default WeatherCard;