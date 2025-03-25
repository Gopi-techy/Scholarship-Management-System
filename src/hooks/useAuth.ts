import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useIsAuthenticated = () => {
  const { currentUser } = useAuth();
  return !!currentUser;
};

export const useIsAdmin = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'admin';
};

export const useIsStudent = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'student';
}; 