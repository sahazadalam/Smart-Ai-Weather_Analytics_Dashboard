import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout, addWeatherAlert, removeWeatherAlert, updateSystemSettings } from '../store/adminSlice';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, weatherAlerts, systemSettings } = useSelector(state => state.admin);
  const [activeTab, setActiveTab] = useState('users');
  const [newAlert, setNewAlert] = useState({ city: '', message: '', severity: 'warning' });
  const [settings, setSettings] = useState(systemSettings);

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/login');
  };

  const handleAddAlert = () => {
    if (newAlert.city && newAlert.message) {
      dispatch(addWeatherAlert(newAlert));
      setNewAlert({ city: '', message: '', severity: 'warning' });
    }
  };

  const handleSaveSettings = () => {
    dispatch(updateSystemSettings(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-logout">Logout</button>
      </header>

      <div className="admin-tabs">
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          👥 Users ({users.length})
        </button>
        <button className={activeTab === 'alerts' ? 'active' : ''} onClick={() => setActiveTab('alerts')}>
          ⚠️ Weather Alerts
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          ⚙️ System Settings
        </button>
        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
          📊 Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Registered Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr><th>ID</th><th>Email</th><th>Name</th><th>Registered Date</th></tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id.slice(0, 8)}...</td>
                      <td>{user.email}</td>
                      <td>{user.displayName}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" className="no-data">No registered users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-section">
            <h2>Weather Alerts</h2>
            <div className="add-alert-form">
              <input
                type="text"
                placeholder="City"
                value={newAlert.city}
                onChange={(e) => setNewAlert({ ...newAlert, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Alert Message"
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              />
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
              >
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Warning</option>
                <option value="critical">🔴 Critical</option>
              </select>
              <button onClick={handleAddAlert}>Add Alert</button>
            </div>

            <div className="alerts-list">
              {weatherAlerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                  <div className="alert-info">
                    <strong>{alert.city}</strong>
                    <p>{alert.message}</p>
                    <small>{new Date(alert.createdAt).toLocaleString()}</small>
                  </div>
                  <button onClick={() => dispatch(removeWeatherAlert(alert.id))}>Delete</button>
                </div>
              ))}
              {weatherAlerts.length === 0 && <p className="no-data">No weather alerts configured</p>}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>System Settings</h2>
            <div className="settings-form">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                />
                Auto-refresh weather data
              </label>
              
              <label>
                Refresh Interval (ms):
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                  disabled={!settings.autoRefresh}
                />
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                />
                Enable Weather Notifications
              </label>
              
              <button onClick={handleSaveSettings}>Save Settings</button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h2>System Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{users.length}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{weatherAlerts.length}</div>
                <div className="stat-label">Active Alerts</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">20+</div>
                <div className="stat-label">Cities Tracked</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;