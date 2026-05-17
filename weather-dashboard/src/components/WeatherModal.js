import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './WeatherModal.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherModal = ({ cityName, onClose }) => {
  const { current, forecast, unit } = useSelector(state => state.weather);
  const [chartData, setChartData] = useState(null);
  const [recommendations, setRecommendations] = useState({
    clothing: [],
    travel: [],
    warnings: []
  });
  
  const weatherData = current[cityName];
  const forecastData = forecast[cityName];
  
  useEffect(() => {
    if (weatherData) {
      generateDetailedRecommendations(weatherData);
    }
  }, [weatherData]);
  
  useEffect(() => {
    if (forecastData && forecastData.list) {
      const dailyForecasts = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5);
      
      const labels = dailyForecasts.map(item => 
        new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })
      );
      
      const temperatures = dailyForecasts.map(item => 
        unit === 'celsius' ? Math.round(item.main.temp) : Math.round((item.main.temp * 9/5) + 32)
      );
      
      setChartData({
        labels,
        datasets: [
          {
            label: `Temperature (${unit === 'celsius' ? '°C' : '°F'})`,
            data: temperatures,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4,
          },
        ],
      });
    }
  }, [forecastData, unit]);
  
  const generateDetailedRecommendations = (data) => {
    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const city = data.name;
    
    const clothing = [];
    const travel = [];
    const warnings = [];
    
    // Detailed Clothing Recommendations based on temperature
    if (temp <= 10) {
      clothing.push('🧥 Wear a heavy winter coat');
      clothing.push('🧣 Use a warm scarf and gloves');
      clothing.push('👢 Wear insulated boots');
      clothing.push('🧤 Use thermal innerwear');
      clothing.push('🧢 Wear a woolen cap/beanie');
      clothing.push('🧦 Wear thick warm socks');
    } else if (temp <= 20) {
      clothing.push('🧥 Wear a light jacket or sweater');
      clothing.push('👖 Wear warm pants/jeans');
      clothing.push('👟 Wear closed comfortable shoes');
      clothing.push('🧣 Carry a light scarf if needed');
      clothing.push('🧤 Light gloves for mornings/evenings');
    } else if (temp <= 30) {
      clothing.push('👕 Wear light cotton clothing');
      clothing.push('🩳 Comfortable shorts (if casual)');
      clothing.push('🕶️ Use sunglasses for sun protection');
      clothing.push('👟 Wear breathable shoes');
      clothing.push('🧢 Use a cap for sun protection');
    } else if (temp <= 35) {
      clothing.push('🩳 Wear light and loose cotton clothes');
      clothing.push('🧢 Use a hat/cap for sun protection');
      clothing.push('💧 Carry a water bottle');
      clothing.push('🕶️ Wear UV protection sunglasses');
      clothing.push('🧴 Apply sunscreen SPF 30+');
      clothing.push('👕 Wear light colors to reflect heat');
    } else {
      clothing.push('🩳 Wear ultra-light, breathable loose clothes');
      clothing.push('🧢 Use a wide-brimmed hat/cap');
      clothing.push('🕶️ Wear UV protection sunglasses');
      clothing.push('🧴 Apply high-SPF sunscreen (50+)');
      clothing.push('💧 Carry 2+ liters of water');
      clothing.push('🧣 Use a cooling towel');
      clothing.push('👕 Wear sweat-wicking fabric');
    }
    
    // Weather condition specific clothing
    if (condition.includes('rain')) {
      clothing.push('☔ Carry an umbrella');
      clothing.push('🧥 Wear a raincoat');
      clothing.push('👢 Wear waterproof shoes');
      clothing.push('📱 Keep phone in waterproof cover');
    }
    
    if (condition.includes('haze') || condition.includes('dust')) {
      clothing.push('😷 Wear a mask for protection');
      clothing.push('🕶️ Wear protective glasses');
      clothing.push('🧥 Use full sleeves to cover skin');
    }
    
    if (condition.includes('clear') || condition.includes('sun')) {
      clothing.push('🕶️ Wear sunglasses');
      clothing.push('🧢 Use sun protection cap');
      clothing.push('🧴 Apply sunscreen');
    }
    
    // High humidity clothing
    if (humidity > 80) {
      clothing.push('👕 Wear moisture-wicking fabric');
      clothing.push('🧴 Carry antiperspirant');
      clothing.push('💧 Carry extra water');
    }
    
    // Detailed Travel & Route Tips
    if (condition.includes('rain')) {
      travel.push('🚗 Use car or metro (avoid two-wheelers)');
      travel.push('🚇 Metro is most reliable during rain');
      travel.push('🗺️ Check traffic updates - avoid waterlogged areas');
      travel.push('⏰ Allow 30-45 extra minutes for travel');
      travel.push('📱 Keep phone in waterproof cover');
      travel.push('🚦 Drive slowly on wet roads');
      travel.push('📍 Use GPS to find alternate routes if needed');
    } else if (temp > 35) {
      travel.push('❌ Avoid outdoor travel between 11 AM - 4 PM');
      travel.push('✅ Best time: Before 10 AM or after 5 PM');
      travel.push('🚗 Use AC transport if possible');
      travel.push('💧 Carry cold water bottle');
      travel.push('🚿 Take cool showers before/after travel');
      travel.push('📍 Plan indoor activities during peak heat');
      travel.push('⛽ Keep vehicle AC checked before long drives');
    } else if (temp < 10) {
      travel.push('✅ Best travel time: 11 AM - 3 PM');
      travel.push('🚗 Warm up car before driving');
      travel.push('🧥 Wear warm layers while traveling');
      travel.push('☕ Carry a warm beverage');
      travel.push('📍 Check road conditions for fog');
      travel.push('⛽ Keep emergency blanket in vehicle');
    } else if (windSpeed > 30) {
      travel.push('🚗 Drive slowly, especially on bridges');
      travel.push('⚠️ Watch for falling branches');
      travel.push('🏍️ Two-wheelers: Consider alternate transport');
      travel.push('📍 Avoid open/highway areas if possible');
      travel.push('🅿️ Park away from trees');
    } else if (condition.includes('haze') || condition.includes('dust')) {
      travel.push('😷 Wear mask while traveling');
      travel.push('🚗 Use car with windows closed');
      travel.push('🚇 Prefer metro over open transport');
      travel.push('📍 Reduce outdoor exposure time');
      travel.push('💧 Keep eyes hydrated with drops if needed');
    } else {
      travel.push('✅ Perfect weather for outdoor activities');
      travel.push('🗺️ Check traffic updates before starting');
      travel.push('⛽ Keep your vehicle fueled');
      travel.push('📍 Use GPS for the best route');
      travel.push('🚶 Enjoy walking or cycling');
      travel.push('📱 Share your location with family');
    }
    
    // General travel tips for all conditions
    travel.push('🗺️ Check traffic updates before leaving');
    travel.push('⛽ Keep your vehicle fueled');
    travel.push('📍 Use GPS for the best route');
    
    // Weather Warnings
    if (temp > 35) {
      warnings.push(`🔥 EXTREME HEAT WARNING for ${city}! Temperature: ${Math.round(temp)}°C`);
      warnings.push('🥤 Drink water every 20-30 minutes');
      warnings.push('🏠 Stay indoors if possible, especially 11 AM - 4 PM');
      warnings.push('🚨 Watch for heat exhaustion symptoms: dizziness, headache, nausea');
    }
    
    if (temp < 5) {
      warnings.push(`❄️ COLD WAVE ALERT in ${city}! Temperature: ${Math.round(temp)}°C`);
      warnings.push('🏠 Stay indoors during early morning hours');
      warnings.push('🧥 Wear multiple warm layers');
    }
    
    if (condition.includes('rain')) {
      warnings.push(`🌧️ RAIN ALERT in ${city}: ${data.weather[0].description}`);
      warnings.push('⚠️ Roads may be slippery - drive carefully');
      warnings.push('📍 Avoid waterlogged areas and underpasses');
    }
    
    if (condition.includes('thunderstorm')) {
      warnings.push('⚡ THUNDERSTORM WARNING!');
      warnings.push('🏠 Stay indoors until storm passes');
      warnings.push('🔌 Unplug electronic devices');
      warnings.push('🚗 Avoid driving during heavy storm');
    }
    
    if (humidity > 85) {
      warnings.push('💧 EXTREME HUMIDITY! Feels hotter than actual temperature');
      warnings.push('💨 Use a fan/AC to stay comfortable');
      warnings.push('👕 Wear breathable, moisture-wicking clothes');
    }
    
    if (windSpeed > 40) {
      warnings.push(`💨 STRONG WINDS: ${Math.round(windSpeed)} km/h`);
      warnings.push('⚠️ Secure loose objects on balconies');
      warnings.push('🚗 Be cautious while driving, especially on bridges');
    }
    
    setRecommendations({ clothing, travel, warnings });
  };
  
  const getTemperature = (temp) => {
    if (unit === 'celsius') {
      return `${Math.round(temp)}°C`;
    }
    return `${Math.round((temp * 9/5) + 32)}°F`;
  };
  
  const getWeatherAdvice = () => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (condition.includes('rain')) {
      return "☔ Rainy conditions - Don't forget your umbrella!";
    }
    if (temp > 35) {
      return "🔥 Extreme heat! Stay hydrated and avoid afternoon sun.";
    }
    if (temp > 30) {
      return "🌞 Hot and sunny - Wear light clothes and use sunscreen.";
    }
    if (temp < 10) {
      return "❄️ Very cold! Wear heavy winter clothes and stay warm.";
    }
    if (temp < 20) {
      return "🍂 Cool weather - A light jacket would be comfortable.";
    }
    return "✅ Pleasant weather - Enjoy your day outdoors!";
  };
  
  if (!weatherData) return null;
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: '5-Day Temperature Forecast',
        color: 'white'
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `Temperature (${unit === 'celsius' ? '°C' : '°F'})`,
          color: 'white'
        },
        ticks: { color: 'white' }
      },
      x: {
        ticks: { color: 'white' }
      }
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            <p className="modal-subtitle">Detailed Weather Analysis & Smart Recommendations</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Current Weather Large */}
          <div className="current-weather-large">
            <div className="current-temp">
              <span className="temp-value">{getTemperature(weatherData.main.temp)}</span>
              <span className="temp-feels">Feels like {getTemperature(weatherData.main.feels_like)}</span>
              <span className="temp-condition">{weatherData.weather[0].description}</span>
            </div>
            <div className="weather-icon-large">
              {weatherData.weather[0].main === 'Clear' && '☀️'}
              {weatherData.weather[0].main === 'Clouds' && '☁️'}
              {weatherData.weather[0].main === 'Rain' && '🌧️'}
              {weatherData.weather[0].main === 'Drizzle' && '🌦️'}
              {weatherData.weather[0].main === 'Thunderstorm' && '⛈️'}
              {weatherData.weather[0].main === 'Haze' && '🌁'}
              {weatherData.weather[0].main === 'Mist' && '🌫️'}
              {weatherData.weather[0].main === 'Smoke' && '💨'}
              {weatherData.weather[0].main === 'Dust' && '💨'}
            </div>
          </div>
          
          {/* Weather Stats Grid */}
          <div className="weather-stats">
            <div className="stat-card">
              <div className="stat-icon">💧</div>
              <div className="stat-info">
                <div className="stat-label">Humidity</div>
                <div className="stat-value">{weatherData.main.humidity}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💨</div>
              <div className="stat-info">
                <div className="stat-label">Wind Speed</div>
                <div className="stat-value">{Math.round(weatherData.wind.speed)} km/h</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-label">Pressure</div>
                <div className="stat-value">{weatherData.main.pressure} hPa</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-info">
                <div className="stat-label">Visibility</div>
                <div className="stat-value">{(weatherData.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>
          
          {/* Smart Recommendations Section */}
          <div className="recommendations-section">
            <div className="section-title">
              <span>🎯 Smart Recommendations for {weatherData.name}</span>
            </div>
            
            {/* Warnings */}
            {recommendations.warnings.length > 0 && (
              <div className="rec-card warnings-card">
                <div className="rec-card-header">⚠️ Weather Warnings</div>
                <ul className="rec-list">
                  {recommendations.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* What to Wear */}
            {recommendations.clothing.length > 0 && (
              <div className="rec-card clothing-card">
                <div className="rec-card-header">👔 What to Wear</div>
                <ul className="rec-list">
                  {recommendations.clothing.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Travel & Route Tips */}
            {recommendations.travel.length > 0 && (
              <div className="rec-card travel-card">
                <div className="rec-card-header">🚗 Travel & Route Tips</div>
                <ul className="rec-list">
                  {recommendations.travel.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-row">
              <span className="info-label">🌅 Sunrise</span>
              <span className="info-value">
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">🌇 Sunset</span>
              <span className="info-value">
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">🌡️ Temperature</span>
              <span className="info-value">{getTemperature(weatherData.main.temp)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🤒 Feels Like</span>
              <span className="info-value">{getTemperature(weatherData.main.feels_like)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📉 Min Temp</span>
              <span className="info-value">{getTemperature(weatherData.main.temp_min)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📈 Max Temp</span>
              <span className="info-value">{getTemperature(weatherData.main.temp_max)}</span>
            </div>
          </div>
          
          {/* Forecast Chart */}
          {chartData && (
            <div className="forecast-chart">
              <div className="section-title">📊 5-Day Forecast</div>
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
          
          {/* General Advice */}
          <div className="general-advice">
            <div className="advice-text">{getWeatherAdvice()}</div>
            <div className="advice-tip">
              💡 Tip: Check weather again before leaving for real-time updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;