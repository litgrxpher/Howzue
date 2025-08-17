
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthLoaded: boolean;
  login: (email: string) => void;
  signup: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('howzue-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage', error);
    }
    setIsAuthLoaded(true);
  }, []);

  const login = (email: string) => {
    // This is a mock login. In a real app, you'd call an API.
    const mockUser = { id: crypto.randomUUID(), email };
    setUser(mockUser);
    localStorage.setItem('howzue-user', JSON.stringify(mockUser));
  };
  
  const signup = (email: string) => {
    // This is a mock signup. In a real app, you'd call an API.
    const mockUser = { id: crypto.randomUUID(), email };
    setUser(mockUser);
    localStorage.setItem('howzue-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('howzue-user');
  };
  
  const authState: AuthState = { user, isAuthLoaded, login, signup, logout };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
