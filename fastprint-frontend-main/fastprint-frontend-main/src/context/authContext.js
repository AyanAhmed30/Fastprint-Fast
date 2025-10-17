'use client';

import React, { createContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load auth state from localStorage on mount (client-side only)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
    
  }, []);

  // Sync auth state across tabs/windows
  useEffect(() => {
    const syncAuth = () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('accessToken');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setToken(savedToken || null);
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Listen specifically for explicit logout-event key to force logout across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === 'logout-event') {
        setUser(null);
        setToken(null);
        // Also cleanup known keys
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token');
        } catch (err) {
          // ignore
        }
        // In this tab, navigate to login
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signup = async (formData) => {
    return authService.register(formData);
  };

  const login = async (formData) => {
    const res = await authService.login(formData);
    setUser(res.user);
    setToken(res.access);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('accessToken', res.access);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear all known token/user keys to be thorough
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');

    // dispatch a storage event to notify other tabs/windows
    try {
      window.localStorage.setItem('logout-event', Date.now().toString());
      // small cleanup
      setTimeout(() => {
        window.localStorage.removeItem('logout-event');
      }, 500);
    } catch (e) {
      // ignore
    }

    // Redirect to login page to avoid showing protected content
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};