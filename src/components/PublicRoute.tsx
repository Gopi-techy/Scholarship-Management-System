import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  // Always allow access for development
  return <>{children}</>;
};

export default PublicRoute; 