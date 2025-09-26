/**
 * Модуль управления моделями продукции (каталог продукции)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';
import { ProductModel } from '../types/entities';
import { dataService } from '../services/dataService';

const Models: React.FC = () => {
  const { authState, hasPermission } = useAuth();
  const [models, setModels] = useState<ProductModel[]>([
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingModel, setEditingModel] = useState<ProductModel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    dimensions: '',
    materialType: '',
    colorOptions: '',
    defaultLabelTemplateId: ''
  });

  const canEdit = hasPermission('manager');

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formData.name || !formData.sku) return;

    const newModel: ProductModel = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      dimensions: formData.dimensions,
      materialType: formData.materialType,
      colorOptions: formData.colorOptions.split(',').map(s => s.trim()),
      defaultLabelTemplateId: formData.defaultLabelTemplateId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await dataService.saveProductModel(newModel);
    setModels(await dataService.getProductModels());
    setIsCreating(false);
    setFormData({
      name: '',
      sku: '',
      dimensions: '',
      materialType: '',
      colorOptions: '',
      defaultLabelTemplateId: ''
    });
  };

  const handleUpdate = async () => {
    if (!editingModel || !formData.name || !formData.sku) return;

    const updatedModel: ProductModel = {
      ...editingModel,
      name: formData.name,
      sku: formData.sku,
      dimensions: formData.dimensions,
      materialType: formData.materialType,
      colorOptions: formData.colorOptions.split(',').map(s => s.trim()),
      defaultLabelTemplateId: formData.defaultLabelTemplateId,
      updatedAt: new Date()
    };

    await dataService.saveProductModel(updatedModel);
    setModels(await dataService.getProductModels());
    setEditingModel(null);
    setFormData({
      name: '',
      sku: '',
      dimensions: '',
      materialType: '',
      colorOptions: '',
      defaultLabelTemplateId: ''
    });
  };

  const handleDelete = async (id: string) => {
    await dataService.deleteProductModel(id);
    setModels(await dataService.getProductModels());
  };

  const startEdit = (model: ProductModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      sku: model.sku,
      dimensions: model.dimensions,
      materialType: model.materialType,
      colorOptions: model.colorOptions.join(', '),
      defaultLabelTemplateId: model.defaultLabelTemplateId
    });
  };

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>
              У вас недостаточно прав для доступа к модулю управления моделями
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Каталог продукции</h1>
                <p className="text-gray-600">Управление моделями мебели</p>
              </div>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить модель
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по названию или SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {(isCreating || editingModel) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingModel ? 'Редактирование модели' : 'Новая модель'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название модели</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Шкаф-купе 'Премиум'"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Габариты</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="2000x600x500 мм"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialType">Тип материала</Label>
                  <Input
                    id="materialType"
                    value={formData.materialType}
                    onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                    placeholder="ЛДСП, Массив дерева"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="colorOptions">Варианты цветов (через запятую)</Label>
                <Input
                  id="colorOptions"
                  value={formData.colorOptions}
                  onChange={(e) => setFormData({ ...formData, colorOptions: e.target.value })}
                  placeholder="Белый, Дуб, Орех"
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={editingModel ? handleUpdate : handleCreate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingModel ? 'Сохранить' : 'Создать'}
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingModel(null);
                    setFormData({
                      name: '',
                      sku: '',
                      dimensions: '',
                      materialType: '',
                      colorOptions: '',
                      defaultLabelTemplateId: ''
                    });
                  }}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Models List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>SKU: {model.sku}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Габариты:</span>
                  <p className="text-sm">{model.dimensions}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Материал:</span>
                  <p className="text-sm">{model.materialType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Цвета:</span>
                  <p className="text-sm">{model.colorOptions.join(', ')}</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent"
                    onClick={() => startEdit(model)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Редактировать
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-transparent text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(model.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Модели не найдены</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Models;