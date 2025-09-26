
/**
 * Главный дашборд системы после аутентификации
 */

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import WorkerDashboard from '../components/dashboard/WorkerDashboard';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, authState.user, navigate]);

  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const renderDashboard = () => {
    switch (authState.user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'worker':
        return <WorkerDashboard />;
      default:
        return <div>Неизвестная роль пользователя</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
