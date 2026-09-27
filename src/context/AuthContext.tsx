'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from localStorage on app mount
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        // Verify token with backend /me endpoint using apiClient
        const data = await apiClient.get('/api/v1/auth/me', { token: storedToken });

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  // User Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await apiClient.post('/api/v1/auth/login', { email, password });

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, message: data.message };
      }

      return {
        success: false,
        message: data.message || 'Login failed. Please check your credentials.',
      };
    } catch (error: any) {
      console.error('Login request error:', error);
      return {
        success: false,
        message: error.message || 'Could not connect to the authentication server.',
      };
    }
  };

  // User Registration
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await apiClient.post('/api/v1/auth/register', { name, email, password });

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, message: data.message };
      }

      return {
        success: false,
        message: data.message || 'Registration failed.',
      };
    } catch (error: any) {
      console.error('Registration request error:', error);
      return {
        success: false,
        message: error.message || 'Could not connect to the registration server.',
      };
    }
  };

  // User Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
