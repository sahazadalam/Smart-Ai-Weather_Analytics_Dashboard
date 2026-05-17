import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { loginSuccess, setGuestMode } from './store/authSlice';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest, user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isMounted) {
        if (user) {
          dispatch(loginSuccess({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            role: 'user'
          }));
        }
        setLoading(false);
      }
    });

    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true' && !auth.currentUser && isMounted) {
      dispatch(setGuestMode());
      setLoading(false);
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading WeatherSphere...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          (!isAuthenticated && !isGuest) ? <Login /> : <Navigate to="/" />
        } />
        <Route path="/admin" element={
          user?.email === 'faisal@gmail.com' ? <AdminPanel /> : <Navigate to="/" />
        } />
        <Route path="/" element={
          (isAuthenticated || isGuest) ? <Dashboard /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;