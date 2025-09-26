/**
 * Модуль отслеживания производственных единиц
 * Печать: скрываем формы/фильтры/кнопки, оставляем список партий и единиц.
 * Для печати применяется контейнер "print-area print-clean grayscale-on-print"
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Package, Printer, Play, Filter, Search } from 'lucide-react';
import { ProductionBatch, ProductionUnit, ProductModel } from '../types/entities';
import { dataService } from '../services/dataService';
import { PrintOnly } from '../components/print/Visibility';

const Production: React.FC = () => {
  const { authState, hasPermission } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock данные
  const [models] = useState<ProductModel[]>([
    {
      id: '1',
      name: 'Шкаф-купе "Премиум"',
      sku: 'SKU-001',
      dimensions: '2000x600x500 мм',
      materialType: 'ЛДСП',
      colorOptions: ['Белый', 'Дуб', 'Орех'],
      defaultLabelTemplateId: '1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Комод "Классик"',
      sku: 'SKU-002',
      dimensions: '800x400x900 мм',
      materialType: 'Массив дерева',
      colorOptions: ['Белый', 'Коричневый'],
      defaultLabelTemplateId: '2',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ]);

  const [batches, setBatches] = useState<ProductionBatch[]>([
    {
      id: '1',
      modelId: '1',
      quantity: 25,
      units: Array.from({ length: 25 }, (_, i) => ({
        id: `unit-1-${i + 1}`,
        modelId: '1',
        modelName: 'Шкаф-купе "Премиум"',
        status: i < 18 ? 'completed' : 'in_progress',
        uuid: `UUID-001-${String(i + 1).padStart(3, '0')}`,
        createdAt: new Date('2024-01-20'),
        completedAt: i < 18 ? new Date('2024-01-21') : undefined,
        finalLabelPrinted: i < 15
      })),
      status: 'in_progress',
      createdAt: new Date('2024-01-20'),
      createdBy: 'Менеджер Производства'
    }
  ]);

  const [newBatch, setNewBatch] = useState({
    modelId: '',
    quantity: 1
  });

  const canStartProduction = hasPermission('manager');

  const allUnits = batches.flatMap(batch => batch.units);
  
  const filteredUnits = allUnits.filter(unit => {
    const matchesStatus = selectedStatus === 'all' || unit.status === selectedStatus;
    const matchesSearch = unit.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.uuid.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const startProduction = async () => {
    if (!newBatch.modelId || newBatch.quantity < 1) return;

    const model = models.find(m => m.id === newBatch.modelId);
    if (!model) return;

    const newUnits: ProductionUnit[] = Array.from({ length: newBatch.quantity }, (_, i) => ({
      id: `unit-${Date.now()}-${i + 1}`,
      modelId: newBatch.modelId,
      modelName: model.name,
      status: 'planned',
      uuid: `UUID-${Date.now()}-${String(i + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      finalLabelPrinted: false
    }));

    const newBatchObj: ProductionBatch = {
      id: Date.now().toString(),
      modelId: newBatch.modelId,
      quantity: newBatch.quantity,
      units: newUnits,
      status: 'planned',
      createdAt: new Date(),
      createdBy: authState.user?.fullName || 'Неизвестно'
    };

    await dataService.saveProductionBatch(newBatchObj);
    setBatches(await dataService.getProductionBatches());
    setNewBatch({ modelId: '', quantity: 1 });
    
    // Имитация печати стартовых меток
    alert(`Стартовые метки для ${newBatch.quantity} единиц отправлены на печать`);
  };

  const printStartLabel = (batch: ProductionBatch) => {
    alert(`Стартовые метки для партии ${batch.id} отправлены на печать`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В работе';
      case 'planned': return 'Запланировано';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header hidden on print */}
      <header className="bg-white shadow-sm border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Производство</h1>
                <p className="text-gray-600">Отслеживание производственных единиц</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="print-area print-clean grayscale-on-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Print header (visible only on print) */}
        <PrintOnly className="mb-4">
          <div>
            <h1 className="text-xl font-bold">Производство — сводка</h1>
            <p className="text-sm">
              Оператор: {authState.user?.fullName || '—'} • Дата: {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
        </PrintOnly>

        {/* Start Production Form - hide in print */}
        {canStartProduction && (
          <Card className="mb-6 no-print">
            <CardHeader>
              <CardTitle>Запуск производства</CardTitle>
              <CardDescription>Создание новой партии производственных единиц</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Модель продукции</Label>
                  <Select value={newBatch.modelId} onValueChange={(value) => setNewBatch({ ...newBatch, modelId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите модель" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Количество</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button onClick={startProduction} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Запустить производство
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters - hide in print */}
        <Card className="mb-6 no-print">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Поиск по модели или UUID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="planned">Запланировано</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center text-sm text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                Найдено: {filteredUnits.length} единиц
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Batches */}
        <div className="space-y-6">
          {batches.map(batch => {
            const completedCount = batch.units.filter(u => u.status === 'completed').length;
            const progress = (completedCount / batch.quantity) * 100;
            const model = models.find(m => m.id === batch.modelId);

            return (
              <Card key={batch.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{model?.name || 'Неизвестная модель'}</CardTitle>
                      <CardDescription>
                        Партия {batch.id} • {batch.quantity} единиц • {new Date(batch.createdAt).toLocaleDateString('ru-RU')}
                      </CardDescription>
                    </div>
                    {/* Action buttons hidden on print */}
                    <div className="flex space-x-2 no-print">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Printer className="h-4 w-4 mr-1" />
                        Печать отчета
                      </Button>
                      {canStartProduction && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent"
                          onClick={() => printStartLabel(batch)}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Печать стартовых меток
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar (screen only) */}
                  <div className="mb-4 no-print">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Прогресс: {completedCount}/{batch.quantity}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Units Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {batch.units.map(unit => (
                      <div key={unit.id} className="border rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{unit.uuid}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(unit.status)} no-print`}>
                            {getStatusText(unit.status)}
                          </span>
                          <span className="text-xs print-clean only-print">
                            {getStatusText(unit.status)}
                          </span>
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <div>Модель: {unit.modelName}</div>
                          <div>Создана: {new Date(unit.createdAt).toLocaleDateString('ru-RU')}</div>
                          {unit.completedAt && (
                            <div>Завершена: {new Date(unit.completedAt).toLocaleDateString('ru-RU')}</div>
                          )}
                          {unit.finalLabelPrinted && (
                            <div className="text-green-600 no-print">Финальная этикетка напечатана</div>
                          )}
                          {unit.finalLabelPrinted && (
                            <div className="only-print">Финальная этикетка напечатана</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {batches.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4 no-print" />
              <p className="text-gray-500">Производственные партии не найдены</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Production;