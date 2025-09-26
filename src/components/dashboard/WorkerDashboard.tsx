/**
 * Дашборд работника линии
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Printer, Scan, Package, CheckCircle } from 'lucide-react';

const WorkerDashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const [scanValue, setScanValue] = useState('');
  const [currentUnit, setCurrentUnit] = useState<any>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Автофокус на поле сканирования при загрузке
  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanValue.trim()) {
      // Заглушка для обработки сканирования
      setCurrentUnit({
        id: scanValue,
        model: 'Шкаф-купе "Премиум"',
        sku: 'SKU-001',
        status: 'Готов к финальной маркировке'
      });
      setScanValue('');
    }
  };

  const handlePrintFinalLabel = () => {
    // Заглушка для печати финальной этикетки
    alert('Финальная этикетка отправлена на печать');
    setCurrentUnit(null);
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  };

  const todaysTasks = [
    { model: 'Шкаф-купе "Премиум"', quantity: 25, completed: 18, status: 'В работе' },
    { model: 'Комод "Классик"', quantity: 15, completed: 15, status: 'Завершено' },
    { model: 'Стол письменный "Офис"', quantity: 30, completed: 30, status: 'Завершено' }
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
                <h1 className="text-xl font-bold text-gray-900">Рабочее место оператора</h1>
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
        {/* Scan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scan Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Сканирование QR-кода
              </CardTitle>
              <CardDescription>
                Отсканируйте QR-код производственной единицы для финальной маркировки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScan} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="scan" className="text-sm font-medium">
                    QR-код единицы
                  </label>
                  <Input
                    ref={scanInputRef}
                    id="scan"
                    type="text"
                    value={scanValue}
                    onChange={(e) => setScanValue(e.target.value)}
                    placeholder="Отсканируйте или введите код вручную"
                    className="text-lg py-3"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Scan className="h-4 w-4 mr-2" />
                  Обработать сканирование
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Unit Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Текущая единица
              </CardTitle>
              <CardDescription>
                Информация о сканированной производственной единице
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUnit ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Модель</p>
                      <p className="font-semibold">{currentUnit.model}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">SKU</p>
                      <p className="font-semibold">{currentUnit.sku}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Статус</p>
                    <p className="font-semibold text-green-600">{currentUnit.status}</p>
                  </div>
                  <Button 
                    onClick={handlePrintFinalLabel} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Печать финальной этикетки
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Scan className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Отсканируйте QR-код для отображения информации</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Задачи на сегодня</CardTitle>
            <CardDescription>Производственные задания и прогресс</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.status === 'Завершено' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {task.status === 'Завершено' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{task.model}</p>
                      <p className="text-sm text-gray-600">
                        {task.completed}/{task.quantity} единиц • {task.status}
                      </p>
                    </div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(task.completed / task.quantity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkerDashboard;