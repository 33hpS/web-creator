/**
 * Модуль финальной маркировки для работников линии
 * Печать: скрываем поля сканирования и кнопки, оставляем фактическую информацию и историю.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Printer, Scan, Package, CheckCircle } from 'lucide-react';
import { printService } from '../services/printService';
import { PrintOnly } from '../components/print/Visibility';

const FinalMarking: React.FC = () => {
  const { authState } = useAuth();
  const [scanValue, setScanValue] = useState('');
  const [currentUnit, setCurrentUnit] = useState<any>(null);
  const [printStatus, setPrintStatus] = useState<'idle' | 'printing' | 'success' | 'error'>('idle');
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Автофокус на поле сканирования при загрузке
  useEffect(() => {
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, []);

  // Mock данные производственных единиц
  const mockUnits = [
    {
      id: 'unit-1-1',
      uuid: 'UUID-001-001',
      modelId: '1',
      modelName: 'Шкаф-купе "Премиум"',
      sku: 'SKU-001',
      dimensions: '2000x600x500 мм',
      materialType: 'ЛДСП',
      color: 'Белый',
      status: 'completed',
      createdAt: new Date('2024-01-21'),
      completedAt: new Date('2024-01-22')
    },
    {
      id: 'unit-1-2', 
      uuid: 'UUID-001-002',
      modelId: '1',
      modelName: 'Шкаф-купе "Премиум"',
      sku: 'SKU-001',
      dimensions: '2000x600x500 мм',
      materialType: 'ЛДСП',
      color: 'Дуб',
      status: 'completed',
      createdAt: new Date('2024-01-21'),
      completedAt: new Date('2024-01-22')
    }
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanValue.trim()) {
      // Поиск единицы по UUID или ID
      const unit = mockUnits.find(u => 
        u.uuid === scanValue || u.id === scanValue
      );

      if (unit) {
        setCurrentUnit(unit);
        setScanValue('');
        setPrintStatus('idle');
      } else {
        setCurrentUnit(null);
        setPrintStatus('error');
        setTimeout(() => setPrintStatus('idle'), 2000);
      }
    }
  };

  const handlePrintFinalLabel = async () => {
    if (!currentUnit) return;

    setPrintStatus('printing');
    
    try {
      // Использование реального сервиса печати
      const success = await printService.printFinalLabel(currentUnit);
      
      if (success) {
        setPrintStatus('success');
        setRecentScans(prev => [{
          ...currentUnit,
          printedAt: new Date(),
          operator: authState.user?.fullName
        }, ...prev.slice(0, 4)]);
        
        setTimeout(() => {
          setCurrentUnit(null);
          setPrintStatus('idle');
          if (scanInputRef.current) {
            scanInputRef.current.focus();
          }
        }, 1000);
      } else {
        setPrintStatus('error');
        setTimeout(() => setPrintStatus('idle'), 2000);
      }
      
    } catch (error) {
      console.error('Print error:', error);
      setPrintStatus('error');
      setTimeout(() => setPrintStatus('idle'), 2000);
    }
  };

  const getPrintButtonProps = () => {
    switch (printStatus) {
      case 'printing':
        return {
          disabled: true,
          className: 'bg-blue-600 hover:bg-blue-700',
          children: <>Печать...</>
        };
      case 'success':
        return {
          disabled: true,
          className: 'bg-green-600 hover:bg-green-700',
          children: <>Успешно напечатано!</>
        };
      case 'error':
        return {
          disabled: true,
          className: 'bg-red-600 hover:bg-red-700',
          children: <>Ошибка печати</>
        };
      default:
        return {
          onClick: handlePrintFinalLabel,
          className: 'bg-green-600 hover:bg-green-700',
          children: <>Печать финальной этикетки</>
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header hidden on print */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Printer className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Финальная маркировка</h1>
                <p className="text-gray-600">Сканирование и печать финальных этикеток</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Оператор: {authState.user?.fullName}
            </div>
          </div>
        </div>
      </header>

      <main className="print-area print-clean grayscale-on-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print header (visible only on print) */}
        <PrintOnly className="mb-4">
          <div>
            <h1 className="text-xl font-bold">Финальная маркировка</h1>
            <p className="text-sm">
              Оператор: {authState.user?.fullName || '—'} • Дата: {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
        </PrintOnly>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Сканирование (hide on print) */}
          <div className="lg:col-span-2 space-y-6 no-print">
            {/* Сканирование QR-кода */}
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
                    <Label htmlFor="scan">QR-код единицы</Label>
                    <Input
                      ref={scanInputRef}
                      id="scan"
                      type="text"
                      value={scanValue}
                      onChange={(e) => setScanValue(e.target.value)}
                      placeholder="Отсканируйте или введите код вручную"
                      className="text-lg py-3 text-center"
                      autoComplete="off"
                    />
                  </div>
                  <Button type="submit" className="w-full min-h-[60px] touch-manipulation" size="lg">
                    <Scan className="h-5 w-5 mr-2" />
                    Обработать сканирование
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Информация о текущей единице */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Текущая производственная единица
                </CardTitle>
                <CardDescription>
                  Информация о сканированной единице для финальной маркировки
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentUnit ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Модель</Label>
                        <p className="font-semibold">{currentUnit.modelName}</p>
                      </div>
                      <div>
                        <Label>SKU</Label>
                        <p className="font-semibold">{currentUnit.sku}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>UUID</Label>
                        <p className="font-mono text-sm">{currentUnit.uuid}</p>
                      </div>
                      <div>
                        <Label>Цвет</Label>
                        <p className="font-semibold">{currentUnit.color}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Габариты</Label>
                        <p className="text-sm">{currentUnit.dimensions}</p>
                      </div>
                      <div>
                        <Label>Материал</Label>
                        <p className="text-sm">{currentUnit.materialType}</p>
                      </div>
                    </div>

                    <div className="pt-4 no-print">
                      <Button 
                        size="lg" 
                        className="w-full"
                        {...getPrintButtonProps()}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        {getPrintButtonProps().children}
                      </Button>
                    </div>
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

          {/* Правая колонка - Статистика и история (printable) */}
          <div className="space-y-6">
            {/* Статистика за смену */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика за смену</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Обработано единиц:</span>
                  <span className="font-bold text-xl text-green-600 no-print">{recentScans.length}</span>
                  <span className="font-bold text-xl only-print">{recentScans.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Начало смены:</span>
                  <span className="text-sm">{new Date().toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Последняя печать: {
                      recentScans[0]?.printedAt 
                        ? new Date(recentScans[0].printedAt).toLocaleTimeString('ru-RU')
                        : 'еще не было'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Последние операции */}
            <Card>
              <CardHeader>
                <CardTitle>Последние операции</CardTitle>
                <CardDescription>Последние 5 напечатанных этикеток</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length > 0 ? (
                  <div className="space-y-3">
                    {recentScans.map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{scan.modelName}</p>
                          <p className="text-xs text-gray-600">{scan.uuid}</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-600 no-print" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Операции не найдены
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Инструкция (можно печатать, текст полезен) */}
            <Card className="bg-blue-50 border-blue-200 no-print">
              <CardHeader>
                <CardTitle className="text-blue-900">Инструкция</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>1. Отсканируйте QR-код единицы</p>
                  <p>2. Проверьте информацию на экране</p>
                  <p>3. Нажмите "Печать финальной этикетки"</p>
                  <p>4. Дождитесь подтверждения печати</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinalMarking;