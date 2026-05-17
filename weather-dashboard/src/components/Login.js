import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, registerWithEmail, loginWithEmail } from '../firebase/config';
import { loginSuccess, setGuestMode } from '../store/authSlice';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = 'faisal@gmail.com';
  const ADMIN_PASSWORD = 'Faisal@123';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(loginSuccess({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: 'user'
      }));
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      dispatch(loginSuccess({
        uid: 'admin_001',
        email: ADMIN_EMAIL,
        displayName: 'Admin User',
        role: 'admin',
        isAdmin: true
      }));
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
    }
    setLoading(false);
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginWithEmail(email, password);
      dispatch(loginSuccess({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || result.user.email.split('@')[0],
        role: 'user'
      }));
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format. Please enter a valid email.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await registerWithEmail(email, password, name);
      dispatch(loginSuccess({
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        role: 'user'
      }));
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already registered. Please login instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format. Please enter a valid email.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(error.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    dispatch(setGuestMode());
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌤️</div>
          <h1>WeatherSphere</h1>
          <p>Your Personal Weather Companion for India</p>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button 
            className={`mode-btn ${!isAdminMode ? 'active' : ''}`}
            onClick={() => !isAdminMode ? null : toggleMode()}
          >
            👤 User
          </button>
          <button 
            className={`mode-btn ${isAdminMode ? 'active' : ''}`}
            onClick={() => isAdminMode ? null : toggleMode()}
          >
            👑 Admin
          </button>
        </div>

        {isAdminMode ? (
          // Admin Login Form
          <form onSubmit={handleAdminLogin} className="login-form">
            <h3 className="form-title">Admin Access</h3>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <button type="submit" className="login-submit admin-submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Admin Login'}
            </button>
            <div className="admin-info">
              <p>Demo Admin Credentials:</p>
              <p className="admin-demo">Email: faisal@gmail.com</p>
              <p className="admin-demo">Password: Faisal@123</p>
            </div>
          </form>
        ) : (
          // User Login/Signup Form
          <>
            <div className="login-tabs">
              <button 
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Login
              </button>
              <button 
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Sign Up
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={isLogin ? handleUserLogin : handleUserSignup} className="login-form">
              {!isLogin && (
                <div className="input-group">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>
              )}
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {!isLogin && (
                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>
              )}
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button onClick={handleGoogleLogin} className="google-btn" disabled={loading}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Continue with Google
            </button>
          </>
        )}

        {!isAdminMode && (
          <button onClick={handleGuestMode} className="guest-btn" disabled={loading}>
            Continue as Guest
          </button>
        )}

        <div className="login-footer">
          <p>
            {isAdminMode 
              ? 'Admin access for system management' 
              : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;