import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './WeatherChatbot.css';

const WeatherChatbot = ({ onClose, weatherData }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      text: "🤖 **Hello! I'm WeatherSphere AI Assistant**\n\nI can help you with real-time weather information for Indian cities!\n\n**What I can do:**\n• 🌡️ Current weather for any city\n• 👔 Smart clothing recommendations\n• 🚗 Travel safety advice\n• 🛣️ Route suggestions\n• ☔ Rain/Umbrella alerts\n• 🔥 Heat & ❄️ Cold warnings\n• ⏰ Best time to go out\n• 💬 General conversation\n\n**Just ask me like:**\n• \"Weather in Bangalore\"\n• \"What to wear in Delhi?\"\n• \"Is Mumbai safe for travel?\"\n• \"How are you?\"\n\n_Note: Cities appear after you search them in the dashboard_", 
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { current } = useSelector(state => state.weather);

  // Get all available cities from weather data
  const availableCities = Object.keys(current || {});
  
  // City aliases for better matching
  const cityAliases = {
    'bangalore': 'Bangalore',
    'bengaluru': 'Bangalore',
    'banglore': 'Bangalore',
    'bengalooru': 'Bangalore',
    'bengaluru': 'Bangalore',
    'mumbai': 'Mumbai',
    'bombay': 'Mumbai',
    'delhi': 'Delhi',
    'new delhi': 'Delhi',
    'chennai': 'Chennai',
    'madras': 'Chennai',
    'kolkata': 'Kolkata',
    'calcutta': 'Kolkata',
    'hyderabad': 'Hyderabad',
    'secunderabad': 'Hyderabad',
    'pune': 'Pune',
    'poonawala': 'Pune',
    'ahmedabad': 'Ahmedabad',
    'surat': 'Surat',
    'jaipur': 'Jaipur',
    'lucknow': 'Lucknow',
    'kanpur': 'Kanpur',
    'nagpur': 'Nagpur',
    'indore': 'Indore'
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Extract specific city from question
  const extractSpecificCity = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for direct mentions of each available city
    for (const city of availableCities) {
      if (lowerQuery.includes(city.toLowerCase())) {
        return city;
      }
    }
    
    // Check aliases
    for (const [alias, actualCity] of Object.entries(cityAliases)) {
      if (lowerQuery.includes(alias)) {
        // Find matching city in available cities
        const match = availableCities.find(c => c.toLowerCase() === actualCity.toLowerCase());
        if (match) return match;
      }
    }
    
    // If specific city mentioned but not in available cities, return null
    const commonCities = ['bangalore', 'mumbai', 'delhi', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'];
    for (const city of commonCities) {
      if (lowerQuery.includes(city)) {
        return null; // City mentioned but not loaded
      }
    }
    
    return null;
  };

  // Handle basic human questions
  const handleHumanQuestion = (question) => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('how are you') || lowerQ.includes('how are u')) {
      return "🤖 **I'm doing great, thank you for asking!**\n\nI'm your WeatherSphere AI Assistant, powered by real-time weather data. I'm here 24/7 to help you with weather forecasts, clothing advice, travel tips, and more!\n\n**How can I help you today?** 🌤️";
    }
    
    if (lowerQ.includes('what is your name') || lowerQ.includes('who are you')) {
      return "🤖 **I'm WeatherSphere AI Assistant!**\n\nI'm your personal weather companion for Indian cities. I can tell you about weather conditions, suggest what to wear, advise on travel safety, and much more!\n\n**Created by:** WeatherSphere Team\n**Purpose:** Helping you plan your day better with accurate weather insights\n**Specialty:** Indian weather patterns and smart recommendations";
    }
    
    if (lowerQ.includes('thank') || lowerQ.includes('thanks')) {
      return "🤖 **You're welcome!** 😊\n\nI'm happy to help! If you need anything else about weather, clothing, travel, or anything weather-related, just ask!\n\n**Stay safe and have a great day!** 🌟";
    }
    
    if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey')) {
      return "🤖 **Hello!** 👋\n\nWelcome to WeatherSphere AI Assistant!\n\nI can help you with:\n• Weather for any Indian city\n• What to wear recommendations\n• Travel safety advice\n• Route suggestions\n• Rain alerts\n• Heat/Cold warnings\n\n**What would you like to know?** 🌤️";
    }
    
    if (lowerQ.includes('help') || lowerQ.includes('what can you do')) {
      return "🤖 **Here's how I can help you:**\n\n**🌡️ Weather Queries:**\n• \"Weather in [city name]\"\n• \"Temperature in Mumbai\"\n• \"Is it raining in Delhi?\"\n\n**👔 Clothing Advice:**\n• \"What to wear in Bangalore?\"\n• \"Should I carry a jacket?\"\n• \"Clothing for Chennai weather\"\n\n**🚗 Travel Tips:**\n• \"Is it safe to travel?\"\n• \"Best time to go out\"\n• \"Road conditions\"\n\n**☔ Rain Alerts:**\n• \"Should I carry umbrella?\"\n• \"Is it raining?\"\n\n**Try asking me about any Indian city!** 🌟";
    }
    
    if (lowerQ.includes('bye') || lowerQ.includes('goodbye')) {
      return "🤖 **Goodbye!** 👋\n\nThank you for using WeatherSphere AI Assistant!\n\nRemember to check the weather before stepping out. Stay safe and have a wonderful day!\n\n**Come back anytime you need weather updates!** 🌤️";
    }
    
    if (lowerQ.includes('love') || lowerQ.includes('like you')) {
      return "🤖 **Aww, thank you!** 😊\n\nI'm just an AI assistant trying to help you with weather information. But your kind words make my circuits happy!\n\n**Is there anything weather-related I can help you with?** 🌟";
    }
    
    return null;
  };

  const getWeatherForCity = (cityName, question) => {
    const weatherInfo = current[cityName];
    
    if (!weatherInfo || !weatherInfo.main) {
      return {
        found: false,
        message: `⚠️ **City "${cityName}" not found in my database**\n\nI currently have weather data for: **${availableCities.join(', ')}**\n\n**How to add ${cityName}:**\n1. Use the search bar at the top\n2. Type "${cityName}"\n3. Press Enter/ Search\n4. The city will be added to your dashboard\n5. Then ask me about it!\n\n**Tip:** You can search for any Indian city! 🇮🇳`
      };
    }

    const temp = Math.round(weatherInfo.main.temp);
    const feelsLike = Math.round(weatherInfo.main.feels_like);
    const tempMin = Math.round(weatherInfo.main.temp_min);
    const tempMax = Math.round(weatherInfo.main.temp_max);
    const condition = weatherInfo.weather[0].description;
    const mainCondition = weatherInfo.weather[0].main.toLowerCase();
    const humidity = weatherInfo.main.humidity;
    const windSpeed = Math.round(weatherInfo.wind.speed);
    const pressure = weatherInfo.main.pressure;
    const visibility = (weatherInfo.visibility / 1000).toFixed(1);
    const city = cityName;
    const lowerQuestion = question.toLowerCase();

    // WEATHER QUERY (specific to this city)
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('temperature') || (!lowerQuestion.includes('wear') && !lowerQuestion.includes('travel') && !lowerQuestion.includes('umbrella'))) {
      return {
        found: true,
        city: city,
        message: `🌍 **WEATHER IN ${city.toUpperCase()}** 🌍\n\n${getWeatherIcon(mainCondition)} **Current Conditions:**\n• 🌡️ Temperature: **${temp}°C** (Feels like ${feelsLike}°C)\n• 📉 Min/Max: ${tempMin}°C / ${tempMax}°C\n• ☁️ Condition: ${condition}\n• 💧 Humidity: **${humidity}%**\n• 💨 Wind: **${windSpeed} km/h**\n• 📊 Pressure: ${pressure} hPa\n• 👁️ Visibility: ${visibility} km\n\n${getWeatherAdvice(temp, mainCondition, humidity)}\n\n💡 **Ask me more about ${city}:**\n• "What to wear in ${city}?"\n• "Is ${city} safe for travel?"\n• "Should I carry umbrella in ${city}?"`
      };
    }

    // CLOTHING QUERY (specific to this city)
    if (lowerQuestion.includes('wear') || lowerQuestion.includes('clothes') || lowerQuestion.includes('dress') || lowerQuestion.includes('outfit')) {
      let clothingResponse = `👔 **WHAT TO WEAR IN ${city.toUpperCase()}** 👔\n\n🌡️ Current: ${temp}°C (Feels like ${feelsLike}°C)\n☁️ Condition: ${condition}\n\n`;
      
      if (temp <= 10) {
        clothingResponse += `❄️ **COLD WEATHER CLOTHING:**\n\n**Base Layer:**\n• Thermal innerwear 🧥\n• Warm woolen sweater\n\n**Mid Layer:**\n• Fleece jacket\n• Woolen cardigan\n\n**Outer Layer:**\n• Heavy winter coat\n• Down jacket\n\n**Accessories:**\n• Warm scarf 🧣\n• Woolen gloves 🧤\n• Beanie/woolen cap\n• Warm socks\n• Winter boots 👢\n\n**💡 Tip:** Layer up! You can remove layers if it gets warmer indoors.`;
      } else if (temp <= 20) {
        clothingResponse += `🍂 **COOL WEATHER CLOTHING:**\n\n**Recommended:**\n• Light sweater or hoodie 🧥\n• Long pants/jeans 👖\n• Light jacket for evening\n• Closed shoes\n• Light scarf if needed\n\n**Optional:**\n• Denim jacket\n• Cardigan\n\n**💡 Tip:** Mornings and evenings are cooler, so carry a light jacket!`;
      } else if (temp <= 30) {
        clothingResponse += `🌤️ **PLEASANT WEATHER CLOTHING:**\n\n**Recommended:**\n• Cotton t-shirt or shirt 👕\n• Light pants/chinos\n• Shorts (for daytime)\n• Comfortable sandals\n• Sunglasses 🕶️\n\n**For Evening:**\n• Light jacket (optional)\n\n**💡 Tip:** Perfect weather for outdoor activities! Wear comfortable, breathable fabrics.`;
      } else {
        clothingResponse += `🔥 **HOT WEATHER CLOTHING:**\n\n**Recommended:**\n• Light cotton/linen clothes 🩳\n• Loose, breathable fabrics\n• Light colors recommended\n• Shorts and sleeveless tops\n• Wide-brimmed hat 🧢\n• UV protection sunglasses\n• Flip-flops/sandals\n\n**Essential Accessories:**\n• Sunscreen (SPF 30+) 🧴\n• Cap or umbrella ☂️\n• Sunglasses\n\n**💡 Tip:** Avoid synthetic fabrics. Natural fabrics like cotton are best.`;
      }
      
      return { found: true, city: city, message: clothingResponse };
    }

    // TRAVEL SAFETY QUERY (specific to this city)
    if (lowerQuestion.includes('travel') || lowerQuestion.includes('safe') || lowerQuestion.includes('go out') || lowerQuestion.includes('outing')) {
      let travelResponse = `🚗 **TRAVEL SAFETY IN ${city.toUpperCase()}** 🚗\n\n🌡️ Temperature: ${temp}°C\n☁️ Condition: ${condition}\n💨 Wind: ${windSpeed} km/h\n\n`;
      
      if (mainCondition.includes('rain')) {
        travelResponse += `⚠️ **RAINY CONDITIONS - Exercise Caution**\n\n**Recommendations:**\n• Use car/metro (avoid two-wheelers) 🚗\n• Carry umbrella/raincoat ☔\n• Drive slowly - wet roads\n• Avoid waterlogged areas\n• Allow extra travel time\n\n**Best transport:** Metro > Car > Bus > Two-wheeler\n\n**🕐 Best time:** Wait for rain to reduce`;
      } else if (temp > 35) {
        travelResponse += `🔥 **HEAT WAVE - Limited Outdoor Activity**\n\n**Recommendations:**\n• ❌ Avoid travel 11 AM - 4 PM\n• ✅ Best time: Before 10 AM or after 5 PM\n• Carry cold water bottle 💧\n• Use AC transport\n• Take frequent breaks\n\n**Risk Level:** HIGH - Stay hydrated!\n\n**🕐 Best time to travel:** Early morning or evening`;
      } else if (temp < 10) {
        travelResponse += `❄️ **COLD WEATHER - Safe with Precautions**\n\n**Recommendations:**\n• Best time: 11 AM - 3 PM\n• Wear warm layers 🧥\n• Carry hot drink if needed\n• Check vehicle heating\n\n**Risk Level:** LOW - Safe with proper clothing\n\n**✅ Safe to travel** with winter gear!`;
      } else if (windSpeed > 30) {
        travelResponse += `💨 **WINDY CONDITIONS - Moderate Caution**\n\n**Recommendations:**\n• Drive slowly, especially on bridges\n• Keep both hands on steering wheel\n• Watch for falling branches\n• Two-wheelers: Consider alternate transport\n\n**Risk Level:** MODERATE - Be cautious\n\n**✅ Generally safe** with precautions`;
      } else {
        travelResponse += `✅ **PERFECT WEATHER FOR TRAVEL**\n\n**Recommendations:**\n• All activities suitable\n• Great for sightseeing 🏞️\n• Perfect for walking/cycling 🚶\n• Ideal for outdoor dining\n\n**Safety Level:** EXCELLENT\n\n**💡 Perfect day to be outdoors - enjoy your trip to ${city}!**`;
      }
      
      return { found: true, city: city, message: travelResponse };
    }

    // RAIN/UMBRELLA QUERY (specific to this city)
    if (lowerQuestion.includes('umbrella') || lowerQuestion.includes('raincoat') || (lowerQuestion.includes('rain') && !lowerQuestion.includes('weather'))) {
      let rainResponse = `☔ **RAIN CHECK FOR ${city.toUpperCase()}** ☔\n\n`;
      
      if (mainCondition.includes('rain')) {
        rainResponse += `⚠️ **RAIN ALERT!**\n\n🌧️ Condition: ${condition}\n💧 Humidity: ${humidity}%\n\n**✅ YES, carry rain protection!**\n\n**Recommended:**\n• Umbrella ☂️\n• Raincoat 🧥\n• Waterproof shoes 👢\n\n**Additional Tips:**\n• Drive carefully\n• Avoid waterlogged areas\n• Carry extra clothes if needed`;
      } else {
        rainResponse += `☀️ **NO RAIN EXPECTED**\n\n🌤️ Condition: ${condition}\n💧 Humidity: ${humidity}%\n\n**❌ No need for umbrella/raincoat**\n\nThe weather is clear and dry.\n\n${temp > 30 ? '🔥 But it\'s hot - carry water bottle! 💧' : 'Enjoy your day without rain worries!'}`;
      }
      
      return { found: true, city: city, message: rainResponse };
    }

    // DEFAULT for this city
    return {
      found: true,
      city: city,
      message: `📊 **WEATHER SUMMARY FOR ${city.toUpperCase()}**\n\n🌡️ ${temp}°C | ${condition}\n💧 ${humidity}% humidity | 💨 ${windSpeed} km/h wind\n\n${getWeatherAdvice(temp, mainCondition, humidity)}\n\n💡 **Try asking about ${city}:**\n• "What to wear in ${city}?"\n• "Is ${city} safe for travel?"\n• "Should I carry umbrella in ${city}?"\n• "Best time to visit ${city}"`
    };
  };

  const getWeatherIcon = (condition) => {
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('clear')) return '☀️';
    if (condition.includes('thunder')) return '⛈️';
    if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
    return '🌡️';
  };

  const getWeatherAdvice = (temp, condition, humidity) => {
    if (condition.includes('rain')) {
      return "☔ **Rain Alert:** Carry umbrella! Roads may be slippery.";
    }
    if (temp > 35) {
      return "🔥 **Heat Wave:** Stay hydrated! Avoid afternoon sun.";
    }
    if (temp > 30) {
      return "🌞 **Warm Day:** Wear light clothes. Use sunscreen.";
    }
    if (temp < 10) {
      return "❄️ **Very Cold:** Wear heavy winter clothes. Stay warm!";
    }
    if (temp < 18) {
      return "🍂 **Cool Weather:** A light jacket recommended.";
    }
    if (humidity > 80) {
      return "💨 **High Humidity:** May feel warmer than actual temperature.";
    }
    return "✅ **Pleasant Weather:** Perfect for outdoor activities!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: input, 
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      // First check if it's a human question
      const humanResponse = handleHumanQuestion(question);
      if (humanResponse) {
        const botMessage = { 
          id: Date.now() + 1, 
          text: humanResponse, 
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        scrollToBottom();
        return;
      }
      
      // Extract which city is being asked about
      const specificCity = extractSpecificCity(question);
      
      if (specificCity) {
        // We found a specific city in the question
        const result = getWeatherForCity(specificCity, question);
        const botMessage = { 
          id: Date.now() + 1, 
          text: result.message, 
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Check if any city mentioned but not loaded
        const cityMentions = ['bangalore', 'mumbai', 'delhi', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'];
        let mentionedCity = null;
        for (const city of cityMentions) {
          if (question.toLowerCase().includes(city)) {
            mentionedCity = city;
            break;
          }
        }
        
        if (mentionedCity && !availableCities.includes(mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1))) {
          const botMessage = { 
            id: Date.now() + 1, 
            text: `⚠️ **City "${mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1)}" not found**\n\nI don't have weather data for ${mentionedCity} yet.\n\n**How to add ${mentionedCity}:**\n1. Use the search bar at the top of the dashboard\n2. Type "${mentionedCity}"\n3. Press Enter/ Search\n4. The city will appear on your dashboard\n5. Then ask me about it!\n\n**Currently loaded cities:** ${availableCities.join(', ')}`, 
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else if (availableCities.length > 0) {
          // No specific city mentioned, show all available cities
          const allWeather = availableCities.map(city => {
            const data = current[city];
            const temp = Math.round(data.main.temp);
            const condition = data.weather[0].description;
            return `• **${city}:** ${temp}°C, ${condition}`;
          }).join('\n');
          
          const botMessage = { 
            id: Date.now() + 1, 
            text: `📊 **WEATHER SUMMARY FOR ALL CITIES**\n\n${allWeather}\n\n💡 **Tip:** Ask about a specific city like:\n• "Weather in Bangalore"\n• "What to wear in Mumbai?"\n• "Is Delhi safe for travel?"`, 
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const botMessage = { 
            id: Date.now() + 1, 
            text: `⚠️ **No cities loaded yet**\n\nPlease search for cities using the search bar at the top of the dashboard.\n\n**Try searching for:**\n• Mumbai\n• Delhi\n• Bangalore\n• Chennai\n• Kolkata\n\nOnce cities are added, I can tell you all about their weather! 🌤️`, 
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
      
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <div className="robot-icon">
            <div className="robot-head">
              <div className="robot-eyes">
                <div className="robot-eye"></div>
                <div className="robot-eye"></div>
              </div>
              <div className="robot-mouth"></div>
            </div>
          </div>
          <div>
            <h3>WeatherSphere AI Assistant</h3>
            <p>Powered by Real-time Weather Data</p>
          </div>
        </div>
        <button className="chatbot-close" onClick={onClose}>
          <span>×</span>
        </button>
      </div>

      <div className="chatbot-status">
        <div className="status-dot"></div>
        <span>Online • {availableCities.length} {availableCities.length === 1 ? 'city' : 'cities'} available</span>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? 'user' : 'bot'} animate-slide`}>
            <div className="message-avatar">
              {msg.isUser ? '👤' : '🤖'}
            </div>
            <div className="message-bubble">
              <div className="message-text">
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line.includes('**') ? (
                      <strong>{line.replace(/\*\*/g, '')}</strong>
                    ) : (
                      line
                    )}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot animate-slide">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                <span className="typing-text">Analyzing weather data for your city...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-suggestions">
        <div className="suggestions-title">💡 Quick Questions</div>
        <div className="suggestions-grid">
          {availableCities.slice(0, 3).map((city, index) => (
            <button 
              key={index} 
              className="suggestion-chip"
              onClick={() => handleSuggestedQuestion(`Weather in ${city}`)}
            >
              🌡️ {city}
            </button>
          ))}
          <button className="suggestion-chip" onClick={() => handleSuggestedQuestion("What should I wear?")}>
            👔 Clothing
          </button>
          <button className="suggestion-chip" onClick={() => handleSuggestedQuestion("Is it safe to travel?")}>
            🚗 Travel safe
          </button>
          <button className="suggestion-chip" onClick={() => handleSuggestedQuestion("How are you?")}>
            💬 Chat
          </button>
        </div>
      </div>

      <div className="chatbot-input-container">
        <div className="chatbot-input-wrapper">
          <span className="input-icon">💬</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${availableCities.length > 0 ? availableCities[0] : 'any city'}...`}
            className="chatbot-input"
          />
          <button onClick={handleSend} className="chatbot-send-btn" disabled={!input.trim()}>
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherChatbot;