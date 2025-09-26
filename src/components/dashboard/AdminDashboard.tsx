
/**
 * Дашборд администратора системы
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Package, Users, Settings, BarChart, FileText, Printer } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { authState, logout } = useAuth();

  const quickActions = [
    {
      title: 'Управление моделями',
      description: 'Каталог продукции',
      icon: Package,
      href: 'models',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Пользователи',
      description: 'Управление доступом',
      icon: Users,
      href: 'users',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Шаблоны этикеток',
      description: 'Настройка маркировки',
      icon: FileText,
      href: 'templates',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Производство',
      description: 'Отслеживание заказов',
      icon: Printer,
      href: 'production',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Отчетность',
      description: 'Аналитика и статистика',
      icon: BarChart,
      href: 'reports',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Настройки',
      description: 'Системные параметры',
      icon: Settings,
      href: 'settings',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const stats = [
    { label: 'Активных пользователей', value: '24', change: '+2' },
    { label: 'Моделей в каталоге', value: '156', change: '+5' },
    { label: 'Заказов в работе', value: '42', change: '-3' },
    { label: 'Завершено сегодня', value: '18', change: '+4' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Панель администратора</h1>
                <p className="text-sm text-gray-600">
                  Добро пожаловать, {authState.user?.fullName}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="bg-transparent">
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрый доступ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={`#/${action.href}`}>Перейти</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>События системы за последние 24 часа</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Новый пользователь зарегистрирован</p>
                    <p className="text-sm text-gray-600">Менеджер: Иван Петров</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">10:30</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Добавлена новая модель</p>
                    <p className="text-sm text-gray-600">Шкаф-купе "Премиум"</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">09:15</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Printer className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Запущена партия производства</p>
                    <p className="text-sm text-gray-600">25 единиц, модель "Комод-2024"</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">08:45</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
