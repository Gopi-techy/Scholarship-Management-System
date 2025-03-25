import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Always allow access for development
  return <>{children}</>;
};

export default PrivateRoute; 