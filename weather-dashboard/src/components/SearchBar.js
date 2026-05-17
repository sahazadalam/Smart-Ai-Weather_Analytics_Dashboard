import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecast, CITY_SUGGESTIONS } from '../store/weatherSlice';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.weather);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  // Indian cities for suggestions
  const popularCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Kanpur', 'Nagpur', 'Indore', 'Patna', 'Bhopal',
    'Surat', 'Vadodara', 'Visakhapatnam', 'Thane', 'Ghaziabad'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (city = null) => {
    const searchCity = city || searchTerm;
    if (!searchCity || !searchCity.trim()) {
      alert('Please enter a city name');
      return;
    }

    setSearchLoading(true);
    try {
      // Format city name for API (add ,IN for India)
      const formattedCity = `${searchCity.trim()},IN`;
      
      // Dispatch both current weather and forecast
      const result = await dispatch(fetchCurrentWeather(formattedCity)).unwrap();
      
      if (result && result.name) {
        // Also fetch forecast
        await dispatch(fetchForecast(formattedCity));
        alert(`✅ ${result.name} weather data loaded successfully!`);
        
        // Clear search and suggestions
        setSearchTerm('');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert(`❌ City "${searchCity}" not found.\n\nPlease try:\n• Check the spelling\n• Use a major Indian city\n• Examples: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchTerm(city);
    setShowSuggestions(false);
    handleSearch(city);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for an Indian city (e.g., Mumbai, Delhi, Bangalore)..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          className="search-input"
          disabled={searchLoading}
        />
        <button 
          onClick={() => handleSearch()} 
          className="search-button"
          disabled={searchLoading || loading}
        >
          {searchLoading ? '⌛' : 'Search'}
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(city)}
            >
              <span className="suggestion-icon">🏙️</span>
              <span className="suggestion-text">{city}</span>
              <span className="suggestion-add">+ Add</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="search-tips">
        <span>🔍 Popular: </span>
        {popularCities.slice(0, 6).map((city, i) => (
          <button 
            key={i} 
            className="popular-city-btn"
            onClick={() => handleSearch(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;