import { useContext } from 'react';
import { AuthContext } from '../lib/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

export const useIsStudent = () => {
  const { user } = useAuth();
  return user?.role === 'student';
}; 