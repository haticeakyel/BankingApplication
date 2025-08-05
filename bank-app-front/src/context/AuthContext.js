import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const user = { token, username: 'User' }; 
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/users/login', credentials);
      const token = response.data.token;
      const user = response.data.user || { username: credentials.username };
  
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from backend");
      }
  
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };
  

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/users/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    delete api.defaults.headers.common['Authorization'];
    
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};