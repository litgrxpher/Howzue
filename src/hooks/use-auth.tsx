
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface User {
  id: string;
  email: string | null;
}

interface AuthState {
  user: User | null;
  isAuthLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // Simulate checking auth status
    const storedUser = localStorage.getItem('howzue-user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setIsAuthLoaded(true);
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock login. In a real app, you'd validate this.
    const mockUser = { id: 'local-user', email };
    localStorage.setItem('howzue-user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = async (email: string, password: string) => {
    // This is a mock signup.
    const mockUser = { id: 'local-user', email };
    localStorage.setItem('howzue-user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    localStorage.removeItem('howzue-user');
    setUser(null);
  };

  const authState: AuthState = useMemo(() => ({
    user,
    isAuthLoaded,
    login,
    signup,
    logout,
  }), [user, isAuthLoaded]);

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
