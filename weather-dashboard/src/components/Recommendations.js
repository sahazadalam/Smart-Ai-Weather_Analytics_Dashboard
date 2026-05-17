import React, { useState, useEffect } from 'react';
import './Recommendations.css';

const Recommendations = ({ weatherData }) => {
  const [recommendations, setRecommendations] = useState({
    clothing: [],
    travel: [],
    warnings: []
  });

  useEffect(() => {
    if (weatherData && weatherData.main) {
      generateRecommendations(weatherData);
    }
  }, [weatherData]);

  const generateRecommendations = (data) => {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const condition = data.weather[0].main.toLowerCase();
    const cityName = data.name;

    const clothing = [];
    const travel = [];
    const warnings = [];

    // Clothing recommendations based on temperature
    if (temp <= 10) {
      clothing.push('🧥 Heavy winter coat required');
      clothing.push('🧣 Scarf and gloves recommended');
      clothing.push('👢 Wear warm boots');
    } else if (temp <= 20) {
      clothing.push('🧥 Light jacket or sweater');
      clothing.push('👖 Wear long pants');
    } else if (temp <= 30) {
      clothing.push('👕 Light cotton clothing');
      clothing.push('🕶️ Sunglasses recommended');
    } else if (temp > 30) {
      clothing.push('🩳 Wear light and loose clothing');
      clothing.push('🧢 Use hat/cap for sun protection');
      clothing.push('💧 Carry water bottle');
    }

    // Raincoat recommendation
    if (condition.includes('rain') || condition.includes('drizzle')) {
      clothing.push('☔ Wear raincoat or carry umbrella');
      clothing.push('👢 Waterproof shoes recommended');
      warnings.push('🌧️ Rain expected - carry rain protection');
    }

    // Summer warnings
    if (temp > 35) {
      warnings.push(`🔥 Extreme Heat Warning for ${cityName}! Stay hydrated and avoid outdoor activities between 11 AM - 4 PM`);
      warnings.push('🥤 Drink water every 30 minutes');
      warnings.push('🏠 Stay indoors if possible');
      clothing.push('🧴 Apply high-SPF sunscreen');
    }

    // Winter warnings
    if (temp < 5) {
      warnings.push(`❄️ Cold Wave Alert in ${cityName}! Minimum temperature dropping`);
      warnings.push('🏠 Stay indoors during early morning hours');
    }

    // High humidity
    if (humidity > 80) {
      warnings.push('💨 High Humidity - May feel uncomfortable');
      clothing.push('💨 Wear breathable fabrics');
    }

    // High wind speed
    if (windSpeed > 30) {
      warnings.push('💨 Strong winds expected - be cautious while traveling');
      travel.push('🚗 Drive slowly and maintain safe distance');
    }

    // Travel recommendations
    if (!condition.includes('rain') && temp >= 15 && temp <= 32) {
      travel.push('✅ Good day for outdoor activities');
      travel.push('🚶 Perfect weather for walking or cycling');
    } else if (condition.includes('rain')) {
      travel.push('🚗 Use car or public transport');
      travel.push('🏠 Consider indoor activities');
    }

    if (temp > 35) {
      travel.push('❌ Avoid outdoor travel between 11 AM - 4 PM');
      travel.push('🚿 Take cool showers frequently');
    }

    if (condition.includes('clear') || condition.includes('sun')) {
      travel.push('☀️ Great day for outdoor plans');
      if (temp > 28) {
        travel.push('🧴 Don\'t forget sunscreen and hat');
      }
    }

    // Route recommendations based on weather
    if (condition.includes('rain')) {
      travel.push('🛣️ Avoid routes with waterlogging history');
      travel.push('🚇 Metro/subway recommended for commute');
    }

    setRecommendations({ clothing, travel, warnings });
  };

  if (!weatherData || !weatherData.main) {
    return null;
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h3>🎯 Smart Recommendations for {weatherData.name}</h3>
        <p>Based on current weather conditions</p>
      </div>

      <div className="recommendations-grid">
        {recommendations.warnings.length > 0 && (
          <div className="recommendation-card warnings">
            <div className="card-header">⚠️ Weather Warnings</div>
            <ul>
              {recommendations.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.clothing.length > 0 && (
          <div className="recommendation-card clothing">
            <div className="card-header">👔 What to Wear</div>
            <ul>
              {recommendations.clothing.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.travel.length > 0 && (
          <div className="recommendation-card travel">
            <div className="card-header">🚗 Travel & Route Tips</div>
            <ul>
              {recommendations.travel.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="current-weather-summary">
        <div className="summary-item">
          <span className="label">Temperature in {weatherData.name}:</span>
          <span className={`value ${weatherData.main.temp > 30 ? 'hot' : weatherData.main.temp < 15 ? 'cold' : 'normal'}`}>
            {Math.round(weatherData.main.temp)}°C
          </span>
        </div>
        <div className="summary-item">
          <span className="label">Condition:</span>
          <span className="value">{weatherData.weather[0].description}</span>
        </div>
        <div className="summary-item">
          <span className="label">Best Time to Go Out:</span>
          <span className="value">
            {getBestTimeToGoOut(weatherData.main.temp, weatherData.weather[0].main)}
          </span>
        </div>
      </div>
    </div>
  );
};

const getBestTimeToGoOut = (temp, condition) => {
  if (condition.toLowerCase().includes('rain')) {
    return 'After rain stops or use umbrella';
  }
  if (temp > 35) {
    return 'Before 10 AM or after 5 PM';
  }
  if (temp < 10) {
    return 'Between 11 AM - 3 PM';
  }
  return 'Anytime is good!';
};

export default Recommendations;