
/**
 * Страница аутентификации пользователей
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package, User, Shield, Factory } from 'lucide-react';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { authState, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(credentials);
    if (!success) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  const roleExamples = [
    {
      role: 'Администратор',
      icon: Shield,
      description: 'Полный доступ ко всем модулям системы',
      color: 'bg-red-100 text-red-600'
    },
    {
      role: 'Менеджер производства',
      icon: Factory,
      description: 'Управление производством и отчетность',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      role: 'Работник линии',
      icon: User,
      description: 'Операции сканирования и маркировки',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const demoAccounts = [
    { username: 'admin', password: 'admin123', role: 'Администратор' },
    { username: 'manager', password: 'manager123', role: 'Менеджер' },
    { username: 'worker', password: 'worker123', role: 'Работник' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Вход в СУПиМ</CardTitle>
            <CardDescription className="text-center">
              Система Управления Производством и Маркировкой
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Введите пароль"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? 'Вход...' : 'Войти в систему'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Демо-аккаунты:</h4>
              <div className="space-y-1 text-xs">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{account.role}:</span>
                    <span className="font-mono">{account.username} / {account.password}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Role Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Система ролевого доступа</h2>
            <p className="text-lg text-gray-600">
              Разграничение прав доступа в соответствии с должностными обязанностями
            </p>
          </div>
          
          <div className="space-y-4">
            {roleExamples.map((role, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                <div className={`p-3 rounded-lg ${role.color}`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{role.role}</h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Безопасность доступа</h4>
            <p className="text-blue-800 text-sm">
              Каждый сотрудник имеет доступ только к тем функциям, которые необходимы 
              для выполнения его рабочих обязанностей
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
