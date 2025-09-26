
/**
 * Компонент для защиты маршрутов на основе ролей пользователей
 */

import React from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { authState, hasPermission } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
