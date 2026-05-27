import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, clearAuthSession, getStoredAuthUser } from '../services/api';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredAuthUser());

  useEffect(() => {
    if (!getStoredAuthUser()) {
      return;
    }

    authApi
      .me()
      .then(setCurrentUser)
      .catch(() => {
        clearAuthSession();
        setCurrentUser(null);
      });
  }, []);

  const login = async (
    cpf: string,
    password: string,
    pin: string,
  ): Promise<User | null> => {
    try {
      const user = await authApi.login(cpf, password, pin);
      setCurrentUser(user);
      return user;
    } catch {
      return null;
    }
  };

  const register = async (
    name: string,
    cpf: string,
    password: string,
    pin: string,
  ): Promise<User | null> => {
    try {
      const user = await authApi.register(name, cpf, password, pin);
      setCurrentUser(user);
      return user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
  };

  const isAdmin = (): boolean => currentUser?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
