import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser, 
  getUserByCPF, 
  saveUser 
} from '../utils/storage';
import { validateCPF, validatePassword, validatePIN, validateName } from '../utils/validation';

// Credenciais do administrador
const ADMIN_CREDENTIALS = {
  cpf: '00000000000',
  password: '111111',
  pin: '2222',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }
  }, []);

  const login = (cpf: string, password: string, pin: string): boolean => {
    // Verifica se é login de administrador
    if (
      cpf === ADMIN_CREDENTIALS.cpf && 
      password === ADMIN_CREDENTIALS.password && 
      pin === ADMIN_CREDENTIALS.pin
    ) {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrador',
        cpf: ADMIN_CREDENTIALS.cpf,
        password: ADMIN_CREDENTIALS.password,
        pin: ADMIN_CREDENTIALS.pin,
        createdAt: new Date().toISOString(),
        isAdmin: true,
        status: 'active',
      };
      setCurrentUser(adminUser);
      setCurrentUserState(adminUser);
      return true;
    }

    // Login normal de usuário
    const user = getUserByCPF(cpf);
    
    if (!user) {
      return false;
    }
    
    if (user.password !== password || user.pin !== pin) {
      return false;
    }
    
    setCurrentUser(user);
    setCurrentUserState(user);
    return true;
  };

  const register = (name: string, cpf: string, password: string, pin: string): boolean => {
    // Validações conforme RdN02, RdN03, RdN06
    if (!validateName(name)) {
      return false;
    }
    
    if (!validateCPF(cpf)) {
      return false;
    }
    
    if (!validatePassword(password)) {
      return false;
    }
    
    if (!validatePIN(pin)) {
      return false;
    }
    
    // Verifica se CPF já existe (RdN06 - Unicidade)
    if (getUserByCPF(cpf)) {
      return false;
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      cpf,
      password,
      pin,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    saveUser(newUser);
    setCurrentUser(newUser);
    setCurrentUserState(newUser);
    return true;
  };

  const logout = () => {
    clearCurrentUser();
    setCurrentUserState(null);
  };

  const isAdmin = (): boolean => {
    return currentUser?.isAdmin === true;
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