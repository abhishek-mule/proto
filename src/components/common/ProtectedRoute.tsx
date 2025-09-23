import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('consumer' | 'farmer' | 'admin')[];
  requireWallet?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireWallet = false 
}) => {
  const { isAuthenticated, user, walletConnection } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'farmer' ? '/farmer' : 
                        user.role === 'admin' ? '/admin' : '/marketplace';
    return <Navigate to={redirectPath} replace />;
  }

  if (requireWallet && !walletConnection) {
    // Could redirect to wallet connection page or show modal
    return <Navigate to="/wallet-connect" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;