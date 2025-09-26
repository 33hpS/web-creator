/**
 * Модуль отчетности и аналитики производства
 * Печать: скрываем панель действий/фильтры, оставляем метрики, графики и списки.
 * Добавлена печатная шапка через PrintOnly.
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PrintOnly } from '../components/print/Visibility';

const Reports: React.FC = () => {
  const { authState } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 дней назад
    end: new Date()
  });

  // Mock данные для отчетов
  const productionStats = {
    totalUnits: 1250,
    completed: 980,
    inProgress: 150,
    planned: 120,
    errors: 12
  };

  const dailyProduction = [
    { date: '2024-01-01', completed: 45, planned: 50, errors: 2 },
    { date: '2024-01-02', completed: 52, planned: 50, errors: 1 },
    { date: '2024-01-03', completed: 48, planned: 50, errors: 0 },
    { date: '2024-01-04', completed: 55, planned: 50, errors: 3 },
    { date: '2024-01-05', completed: 50, planned: 50, errors: 1 },
    { date: '2024-01-06', completed: 47, planned: 50, errors: 0 },
    { date: '2024-01-07', completed: 53, planned: 50, errors: 2 }
  ];

  const modelPerformance = [
    { name: 'Шкаф-купе "Премиум"', value: 45, color: '#3B82F6' },
    { name: 'Комод "Классик"', value: 25, color: '#10B981' },
    { name: 'Стол письменный "Офис"', value: 15, color: '#F59E0B' },
    { name: 'Тумба прикроватная', value: 10, color: '#EF4444' },
    { name: 'Другие модели', value: 5, color: '#8B5CF6' }
  ];

  const operatorEfficiency = [
    { name: 'Иван Петров', efficiency: 98, units: 245 },
    { name: 'Мария Сидорова', efficiency: 95, units: 198 },
    { name: 'Алексей Козлов', efficiency: 92, units: 176 },
    { name: 'Елена Новикова', efficiency: 89, units: 154 },
    { name: 'Дмитрий Волков', efficiency: 85, units: 132 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const exportReport = (format: 'csv' | 'pdf') => {
    // Заглушка для экспорта отчета
    alert(`Отчет экспортирован в формате ${format.toUpperCase()}`);
  };

  const calculateEfficiency = () => {
    return ((productionStats.completed / productionStats.totalUnits) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header hidden on print */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Отчетность и аналитика</h1>
                <p className="text-gray-600">Статистика производства и эффективности</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange.start.toLocaleDateString('ru-RU')} - {dateRange.end.toLocaleDateString('ru-RU')}
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="print-area print-clean grayscale-on-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print header (visible only on print) */}
        <PrintOnly className="mb-4">
          <div>
            <h1 className="text-xl font-bold">Отчетность и аналитика</h1>
            <p className="text-sm">
              Пользователь: {authState.user?.fullName || '—'} • Период: {dateRange.start.toLocaleDateString('ru-RU')} — {dateRange.end.toLocaleDateString('ru-RU')}
            </p>
          </div>
        </PrintOnly>

        {/* Ключевые метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего единиц</p>
                  <p className="text-2xl font-bold text-gray-900">{productionStats.totalUnits}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600 no-print" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                За период: {dateRange.start.toLocaleDateString('ru-RU')} - {dateRange.end.toLocaleDateString('ru-RU')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Завершено</p>
                  <p className="text-2xl font-bold text-green-600">{productionStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 no-print" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Эффективность: {calculateEfficiency()}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">В работе</p>
                  <p className="text-2xl font-bold text-orange-600">{productionStats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600 no-print" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                +{productionStats.planned} запланировано
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ошибки</p>
                  <p className="text-2xl font-bold text-red-600">{productionStats.errors}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600 no-print" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {(productionStats.errors / productionStats.totalUnits * 100).toFixed(1)}% от общего объема
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* График ежедневного производства */}
          <Card>
            <CardHeader>
              <CardTitle>Ежедневное производство</CardTitle>
              <CardDescription>Динамика выпуска продукции по дням</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10B981" name="Завершено" />
                  <Bar dataKey="planned" fill="#3B82F6" name="Запланировано" />
                  <Bar dataKey="errors" fill="#EF4444" name="Ошибки" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Распределение по моделям */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение по моделям</CardTitle>
              <CardDescription>Доля каждой модели в общем производстве</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modelPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {modelPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Эффективность операторов */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Эффективность операторов</CardTitle>
            <CardDescription>Производительность работников линии</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operatorEfficiency.map((operator, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center no-print">
                      <span className="font-semibold text-blue-600">
                        {operator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{operator.name}</p>
                      <p className="text-sm text-gray-600">Обработано единиц: {operator.units}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{operator.efficiency}%</p>
                    <p className="text-sm text-gray-600">Эффективность</p>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2 no-print">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${operator.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Экспорт отчетов - screen only */}
        <Card className="no-print">
          <CardHeader>
            <CardTitle>Экспорт отчетов</CardTitle>
            <CardDescription>Скачайте отчеты в различных форматах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button onClick={() => exportReport('csv')} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Экспорт в CSV
              </Button>
              <Button onClick={() => exportReport('pdf')} variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Экспорт в PDF
              </Button>
              <Button variant="outline" className="bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Сводный отчет
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;