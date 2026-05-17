import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './UserProfile.css';

const UserProfile = ({ onLogout }) => {
  const { user, isGuest } = useSelector(state => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };
  
  return (
    <div className="user-profile">
      <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="profile-avatar" />
        ) : (
          <div className="profile-initials">
            {getInitials(user?.displayName)}
          </div>
        )}
        <span className="profile-name">{user?.displayName?.split(' ')[0] || 'User'}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <div className="dropdown-initials">{getInitials(user?.displayName)}</div>
              )}
            </div>
            <div className="dropdown-info">
              <div className="dropdown-name">{user?.displayName}</div>
              <div className="dropdown-email">{user?.email}</div>
              {isGuest && <div className="guest-badge">Guest Mode</div>}
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-stats">
            <div className="stat">
              <span className="stat-value">{new Date().getHours()}</span>
              <span className="stat-label">Hour</span>
            </div>
            <div className="stat">
              <span className="stat-value">{new Date().toLocaleDateString()}</span>
              <span className="stat-label">Date</span>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button onClick={onLogout} className="dropdown-logout">
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;