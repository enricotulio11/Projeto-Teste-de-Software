import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '../utils/storage';
import { apiPost, clearAccessToken, setAccessToken } from '../services/api';
import { BackendUser, getMe, mapBackendUser } from '../services/medagenda';

interface LoginResponse {
  accessToken: string;
  usuario: BackendUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }

    getMe()
      .then((backendUser) => {
        const freshUser = mapBackendUser(backendUser);
        setCurrentUser(freshUser);
        setCurrentUserState(freshUser);
      })
      .catch(() => {
        clearAccessToken();
        clearCurrentUser();
        setCurrentUserState(null);
      });
  }, []);

  const login = async (cpf: string, password: string): Promise<User | null> => {
    try {
      const response = await apiPost<LoginResponse>(
        '/autenticacao/login',
        { cpf, senha: password },
        { auth: false },
      );
      const user = mapBackendUser(response.usuario);

      setAccessToken(response.accessToken);
      setCurrentUser(user);
      setCurrentUserState(user);

      return user;
    } catch {
      return null;
    }
  };

  const register = async (
    name: string,
    cpf: string,
    email: string,
    password: string,
  ): Promise<User | null> => {
    try {
      await apiPost(
        '/autenticacao/cadastro',
        { nome: name, cpf, email, senha: password },
        { auth: false },
      );

      return await login(cpf, password);
    } catch {
      return null;
    }
  };

  const logout = () => {
    clearAccessToken();
    clearCurrentUser();
    setCurrentUserState(null);
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin' || currentUser?.isAdmin === true;
  };

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
