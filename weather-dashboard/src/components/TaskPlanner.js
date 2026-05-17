import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, deleteTask, toggleTask } from '../store/tasksSlice';
import './TaskPlanner.css';

const TaskPlanner = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(state => state.tasks);
  const { current } = useSelector(state => state.weather);
  const [showPlanner, setShowPlanner] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCity, setTaskCity] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskType, setTaskType] = useState('personal');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  
  const availableCities = Object.keys(current || {});

  useEffect(() => {
    // Set default date to today when modal opens
    if (showPlanner && !taskDate) {
      const today = new Date().toISOString().split('T')[0];
      setTaskDate(today);
    }
  }, [showPlanner, taskDate]);

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskCity('');
    const today = new Date().toISOString().split('T')[0];
    setTaskDate(today);
    setTaskTime('');
    setTaskLocation('');
    setTaskType('personal');
    setTaskPriority('medium');
    setEditingTask(null);
  };

  const handleClosePlanner = () => {
    setShowPlanner(false);
    resetForm();
  };

  const getWeatherForCityAndDate = (city, date, time) => {
    const weatherData = current[city];
    if (!weatherData) return null;
    
    const temp = Math.round(weatherData.main.temp);
    const condition = weatherData.weather[0].description;
    const mainCondition = weatherData.weather[0].main.toLowerCase();
    const humidity = weatherData.main.humidity;
    const windSpeed = Math.round(weatherData.wind.speed);
    
    const hour = time ? parseInt(time.split(':')[0]) : 12;
    const taskDateObj = new Date(date);
    const today = new Date();
    const isFuture = taskDateObj > today;
    
    let finalTemp = temp;
    if (hour >= 12 && hour <= 15) finalTemp += 3;
    else if (hour >= 6 && hour <= 9) finalTemp -= 2;
    else if (hour >= 19 && hour <= 23) finalTemp -= 4;
    
    if (isFuture) {
      const month = taskDateObj.getMonth();
      if (month >= 3 && month <= 5) finalTemp += 5;
      else if (month >= 6 && month <= 8) finalTemp -= 3;
      else if (month >= 9 && month <= 11) finalTemp -= 2;
    }
    
    return {
      temp: Math.round(finalTemp),
      condition,
      mainCondition,
      humidity,
      windSpeed,
      isFuture,
      hour
    };
  };
  
  const getSmartRecommendations = (task) => {
    const weather = getWeatherForCityAndDate(task.city, task.date, task.time);
    if (!weather) return null;
    
    const recommendations = {
      clothing: [],
      warnings: [],
      bestTime: [],
      transportSuggestions: [],
      preparationTips: []
    };
    
    const { temp, mainCondition, humidity, windSpeed, hour } = weather;
    
    if (temp <= 10) {
      recommendations.clothing.push('🧥 Heavy winter coat required');
      recommendations.clothing.push('🧣 Warm scarf and gloves');
      recommendations.clothing.push('👢 Insulated boots');
    } else if (temp <= 20) {
      recommendations.clothing.push('🧥 Light jacket or sweater');
      recommendations.clothing.push('👖 Warm pants/jeans');
      recommendations.clothing.push('👟 Closed comfortable shoes');
    } else if (temp <= 30) {
      recommendations.clothing.push('👕 Light cotton clothing');
      recommendations.clothing.push('🕶️ Sunglasses for sun protection');
    } else {
      recommendations.clothing.push('🩳 Light, breathable loose clothes');
      recommendations.clothing.push('🧢 Wide-brimmed hat/cap');
      recommendations.clothing.push('🕶️ UV protection sunglasses');
      recommendations.clothing.push('🧴 Apply sunscreen SPF 30+');
      recommendations.preparationTips.push('💧 Carry water bottle');
    }
    
    if (mainCondition.includes('rain')) {
      recommendations.warnings.push('☔ RAIN ALERT: Carry umbrella/raincoat');
      recommendations.warnings.push('👢 Wear waterproof shoes');
      recommendations.transportSuggestions.push('🚗 Use car or metro');
      recommendations.preparationTips.push('⏰ Allow 30 extra minutes for travel');
    }
    
    if (temp > 35) {
      recommendations.warnings.push('🔥 EXTREME HEAT WARNING!');
      recommendations.warnings.push('🌡️ Temperature above 35°C - Stay hydrated');
      recommendations.bestTime.push('✅ Best time: Before 10 AM or after 5 PM');
      recommendations.bestTime.push('❌ Avoid 12 PM - 3 PM');
      recommendations.preparationTips.push('💧 Drink water every 20 minutes');
    } else if (temp > 30) {
      recommendations.warnings.push('🌞 High temperature warning');
      recommendations.preparationTips.push('💧 Carry water bottle');
      recommendations.preparationTips.push('🧴 Apply sunscreen');
    }
    
    if (temp < 15) {
      recommendations.warnings.push('❄️ Cold weather alert');
      recommendations.bestTime.push('✅ Best time to go out: 11 AM - 3 PM');
      recommendations.preparationTips.push('☕ Carry a warm beverage');
    }
    
    if (windSpeed > 30) {
      recommendations.warnings.push(`💨 Strong winds (${windSpeed} km/h) expected`);
      recommendations.transportSuggestions.push('🚗 Drive slowly on bridges');
    }
    
    if (humidity > 80) {
      recommendations.warnings.push('💧 High humidity - May feel uncomfortable');
      recommendations.clothing.push('👕 Wear moisture-wicking fabric');
    }
    
    if (hour >= 22 || hour <= 5) {
      recommendations.warnings.push('🌙 Late night activity - Stay safe');
      recommendations.transportSuggestions.push('🚗 Pre-book cab for return');
      recommendations.preparationTips.push('📱 Share your location with family');
    }
    
    if (task.type === 'work') {
      recommendations.preparationTips.push('💼 Carry work essentials');
      recommendations.clothing.push('👔 Professional attire');
    } else if (task.type === 'meeting') {
      recommendations.clothing.push('👔 Business casual recommended');
      recommendations.preparationTips.push('📋 Carry notebook/tablet');
    } else if (task.type === 'shopping') {
      recommendations.preparationTips.push('🛍️ Carry reusable shopping bags');
    } else if (task.type === 'exercise') {
      if (temp > 30) {
        recommendations.warnings.push('⚠️ Too hot for strenuous exercise');
        recommendations.bestTime.push('✅ Exercise indoors or early morning');
      }
      recommendations.clothing.push('👕 Moisture-wicking sportswear');
      recommendations.preparationTips.push('💧 Carry sports drink');
    } else if (task.type === 'travel') {
      recommendations.transportSuggestions.push('🚖 Book cab in advance');
      recommendations.preparationTips.push('🧳 Pack light for weather');
    }
    
    if (task.priority === 'high') {
      recommendations.preparationTips.push('⭐ High priority - Plan backup arrangements');
      recommendations.warnings.push('⚠️ Have a contingency plan');
    }
    
    return recommendations;
  };
  
  const handleAddTask = () => {
    if (!taskTitle || taskTitle.trim() === '') {
      alert('Please enter a task name');
      return;
    }
    
    if (!taskCity || taskCity.trim() === '') {
      alert('Please select a city');
      return;
    }
    
    if (!taskDate) {
      alert('Please select a date');
      return;
    }
    
    if (!taskTime) {
      alert('Please select a time');
      return;
    }
    
    if (!current[taskCity]) {
      alert(`City "${taskCity}" not found. Please search for this city first in the dashboard.`);
      return;
    }
    
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      title: taskTitle.trim(),
      description: taskDescription,
      city: taskCity,
      date: taskDate,
      time: taskTime,
      location: taskLocation,
      type: taskType,
      priority: taskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (editingTask) {
      dispatch(updateTask(newTask));
      alert('Task updated successfully!');
    } else {
      dispatch(addTask(newTask));
      alert('Task added successfully!');
    }
    
    resetForm();
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskCity(task.city);
    setTaskDate(task.date);
    setTaskTime(task.time);
    setTaskLocation(task.location || '');
    setTaskType(task.type);
    setTaskPriority(task.priority);
    setShowPlanner(true);
  };
  
  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };
  
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (selectedFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.date === today);
    } else if (selectedFilter === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.date > today);
    } else if (selectedFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (selectedFilter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    }
    
    if (selectedCityFilter !== 'all') {
      filtered = filtered.filter(t => t.city === selectedCityFilter);
    }
    
    return filtered.sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffa500';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };
  
  const getTaskTypeIcon = (type) => {
    switch(type) {
      case 'work': return '💼';
      case 'meeting': return '📊';
      case 'shopping': return '🛍️';
      case 'exercise': return '🏃';
      case 'travel': return '✈️';
      default: return '📝';
    }
  };
  
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  };
  
  const isTaskToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };
  
  const isTaskTomorrow = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateStr === tomorrow.toISOString().split('T')[0];
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <>
      <button 
        className="task-planner-header-btn"
        onClick={() => setShowPlanner(true)}
      >
        📋 Task Planner
        {tasks.filter(t => !t.completed && t.date === new Date().toISOString().split('T')[0]).length > 0 && (
          <span className="task-badge">
            {tasks.filter(t => !t.completed && t.date === new Date().toISOString().split('T')[0]).length}
          </span>
        )}
      </button>

      {showPlanner && (
        <div className="task-planner-modal-overlay" onClick={handleClosePlanner}>
          <div className="task-planner-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="task-planner-modal-header">
              <div className="modal-header-title">
                <span className="modal-header-icon">📋</span>
                <div>
                  <h2>Smart Task Planner</h2>
                  <p>Plan your day with weather-based intelligence</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleClosePlanner}>×</button>
            </div>
            
            <div className="task-planner-modal-body">
              {/* Add/Edit Task Form */}
              <div className="task-form-card">
                <h3>{editingTask ? '✏️  Edit Task' : '➕ Add New Task'}</h3>
                <div className="task-form-grid">
                  <div className="form-field full-width">
                    <label>Task Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Submit project report, Visit doctor, Grocery shopping"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>🏙️ City *</label>
                    <select
                      value={taskCity}
                      onChange={(e) => setTaskCity(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select a city</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {availableCities.length === 0 && (
                      <p className="field-warning">⚠️ No cities loaded. Please search for cities first.</p>
                    )}
                  </div>
                  
                  <div className="form-field">
                    <label>📅 Date *</label>
                    <input
                      type="date"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>⏰ Time *</label>
                    <input
                      type="time"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>📍 Location (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Koramangala, Indiranagar"
                      value={taskLocation}
                      onChange={(e) => setTaskLocation(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-field full-width">
                    <label>📝 Description (Optional)</label>
                    <textarea
                      placeholder="Add more details about your task..."
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="form-textarea"
                      rows="2"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Task Type</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="form-select">
                      <option value="personal">📝 Personal</option>
                      <option value="work">💼 Work</option>
                      <option value="meeting">📊 Meeting</option>
                      <option value="shopping">🛍️ Shopping</option>
                      <option value="exercise">🏃 Exercise</option>
                      <option value="travel">✈️ Travel</option>
                    </select>
                  </div>
                  
                  <div className="form-field">
                    <label>Priority</label>
                    <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="form-select">
                      <option value="low">🟢 LOW</option>
                      <option value="medium">🟡 MEDIUM</option>
                      <option value="high">🔴 HIGH</option>
                    </select>
                  </div>
                  
                  <div className="form-actions">
                    <button onClick={handleAddTask} className="btn-submit">
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                    {editingTask && (
                      <button onClick={resetForm} className="btn-cancel">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Filters */}
              <div className="filters-card">
                <div className="filter-group">
                  <label>Filter by Status:</label>
                  <div className="filter-buttons">
                    <button className={selectedFilter === 'all' ? 'filter-active' : ''} onClick={() => setSelectedFilter('all')}>All</button>
                    <button className={selectedFilter === 'today' ? 'filter-active' : ''} onClick={() => setSelectedFilter('today')}>Today</button>
                    <button className={selectedFilter === 'upcoming' ? 'filter-active' : ''} onClick={() => setSelectedFilter('upcoming')}>Upcoming</button>
                    <button className={selectedFilter === 'pending' ? 'filter-active' : ''} onClick={() => setSelectedFilter('pending')}>Pending</button>
                    <button className={selectedFilter === 'completed' ? 'filter-active' : ''} onClick={() => setSelectedFilter('completed')}>Completed</button>
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Filter by City:</label>
                  <select value={selectedCityFilter} onChange={(e) => setSelectedCityFilter(e.target.value)} className="city-filter">
                    <option value="all">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Tasks List */}
              <div className="tasks-card">
                <h3>📋 Your Tasks ({filteredTasks.length})</h3>
                {filteredTasks.length === 0 ? (
                  <div className="empty-tasks">
                    <div className="empty-icon">📭</div>
                    <p>No tasks found. Add your first task above!</p>
                  </div>
                ) : (
                  <div className="tasks-list">
                    {filteredTasks.map(task => {
                      const recommendations = getSmartRecommendations(task);
                      const isToday = isTaskToday(task.date);
                      const isTomorrow = isTaskTomorrow(task.date);
                      
                      return (
                        <div key={task.id} className={`task-card ${task.completed ? 'task-completed' : ''} priority-${task.priority}`}>
                          <div className="task-card-header">
                            <div className="task-status-area">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => dispatch(toggleTask(task.id))}
                                className="task-checkbox"
                              />
                              <div className="task-type-badge">{getTaskTypeIcon(task.type)}</div>
                            </div>
                            <div className="task-info-area">
                              <div className="task-title-row">
                                <h4 className="task-name">{task.title}</h4>
                                <span className="task-priority" style={{ background: getPriorityColor(task.priority) }}>
                                  {task.priority}
                                </span>
                              </div>
                              {task.description && <p className="task-desc">{task.description}</p>}
                              <div className="task-meta-info">
                                <span className="meta-tag">🏙️ {task.city}</span>
                                <span className="meta-tag">📅 {formatDate(task.date)} {isToday && <span className="today-tag">Today</span>}{isTomorrow && <span className="tomorrow-tag">Tomorrow</span>}</span>
                                <span className="meta-tag">⏰ {task.time}</span>
                                {task.location && <span className="meta-tag">📍 {task.location}</span>}
                              </div>
                            </div>
                            <div className="task-action-buttons">
                              <button onClick={() => handleEditTask(task)} className="edit-btn" title="Edit">✏️ EDIT </button>
                              <button onClick={() => handleDeleteTask(task.id)} className="delete-btn" title="Delete">    🗑️ DELETE</button>
                            </div>
                          </div>
                          
                          {!task.completed && recommendations && (
                            <div className="task-recommendations">
                              <div className="rec-header">
                                <span>🌤️ Weather-Based Recommendations for {task.city}</span>
                              </div>
                              <div className="rec-grid">
                                {recommendations.warnings.length > 0 && (
                                  <div className="rec-box warnings-box">
                                    <div className="rec-title">⚠️ Warnings</div>
                                    <ul>
                                      {recommendations.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                  </div>
                                )}
                                
                                {recommendations.clothing.length > 0 && (
                                  <div className="rec-box clothing-box">
                                    <div className="rec-title">👔 What to Wear</div>
                                    <ul>
                                      {recommendations.clothing.map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                  </div>
                                )}
                                
                                {recommendations.bestTime.length > 0 && (
                                  <div className="rec-box time-box">
                                    <div className="rec-title">⏰ Best Time</div>
                                    <ul>
                                      {recommendations.bestTime.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                  </div>
                                )}
                                
                                {recommendations.transportSuggestions.length > 0 && (
                                  <div className="rec-box transport-box">
                                    <div className="rec-title">🚗 Transport</div>
                                    <ul>
                                      {recommendations.transportSuggestions.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                  </div>
                                )}
                                
                                {recommendations.preparationTips.length > 0 && (
                                  <div className="rec-box prep-box">
                                    <div className="rec-title">📝 Preparation</div>
                                    <ul>
                                      {recommendations.preparationTips.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Tips */}
              <div className="tips-card">
                <div className="tips-header">💡 Pro Tips</div>
                <div className="tips-grid">
                  <div className="tip-item">🌡️ Avoid outdoor tasks between 12-3 PM in summer</div>
                  <div className="tip-item">☔ Carry umbrella if rain is forecast</div>
                  <div className="tip-item">🚗 Allow 30 extra minutes during rain</div>
                  <div className="tip-item">👔 Dress in layers for changing weather</div>
                  <div className="tip-item">💧 Stay hydrated above 30°C</div>
                  <div className="tip-item">📱 Share location for late-night tasks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskPlanner;