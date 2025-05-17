import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token in localStorage and verify it
    const token = localStorage.getItem('auth_token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async token => {
    setLoading(true);
    try {
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Authentication error:', err);
      localStorage.removeItem('auth_token');
      setCurrentUser(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      setCurrentUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async userData => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      setCurrentUser(user);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
  };

  const updateProfile = async userData => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put('/api/auth/me', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage =
        err.response?.data?.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async passwordData => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('/api/auth/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Password change error:', err);
      const errorMessage =
        err.response?.data?.message || 'Password change failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
