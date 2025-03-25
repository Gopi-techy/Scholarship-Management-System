import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  uid: string;
  email: string;
  role: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserRole: (role: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Default admin user for development
  const defaultUser: User = {
    uid: '1',
    email: 'admin@example.com',
    role: 'admin'
  };

  const login = async () => {
    // No-op for development
  };

  const register = async () => {
    // No-op for development
  };

  const logout = async () => {
    // No-op for development
  };

  const resetPassword = async () => {
    // No-op for development
  };

  const updateUserRole = async () => {
    // No-op for development
  };

  const value = {
    currentUser: defaultUser,
    isAuthenticated: true,
    loading: false,
    login,
    register,
    logout,
    resetPassword,
    updateUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 