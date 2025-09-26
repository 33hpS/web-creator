/**
 * Сервис для работы с данными системы (эмуляция работы с БД)
 * Использует localStorage для персистентного хранения данных
 */

import { ProductModel, ProductionBatch, LabelTemplate, SystemUser } from '../types/entities';

class DataService {
  private storageKey = {
    models: 'supim_product_models',
    batches: 'supim_production_batches',
    templates: 'supim_label_templates',
    users: 'supim_system_users'
  };

  // Инициализация mock данных при первом запуске
  private initializeMockData() {
    if (!localStorage.getItem(this.storageKey.models)) {
      const mockModels: ProductModel[] = [
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
      ];
      localStorage.setItem(this.storageKey.models, JSON.stringify(mockModels));
    }

    if (!localStorage.getItem(this.storageKey.batches)) {
      const mockBatches: ProductionBatch[] = [
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
      ];
      localStorage.setItem(this.storageKey.batches, JSON.stringify(mockBatches));
    }

    if (!localStorage.getItem(this.storageKey.templates)) {
      const mockTemplates: LabelTemplate[] = [
        {
          id: '1',
          name: 'Стандартный шаблон',
          content: '{modelName}\\n{sku}\\n{dimensions}\\n{productionDate}\\n{uuid}',
          width: 100,
          height: 60,
          isDefault: true,
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: 'Расширенный шаблон',
          content: 'ПРОИЗВОДСТВО СУПиМ\\nМодель: {modelName}\\nАртикул: {sku}\\nГабариты: {dimensions}\\nДата: {productionDate}\\nID: {uuid}',
          width: 120,
          height: 80,
          isDefault: false,
          createdAt: new Date('2024-01-05')
        }
      ];
      localStorage.setItem(this.storageKey.templates, JSON.stringify(mockTemplates));
    }
  }

  // Product Models
  async getProductModels(): Promise<ProductModel[]> {
    this.initializeMockData();
    const data = localStorage.getItem(this.storageKey.models);
    return data ? JSON.parse(data) : [];
  }

  async saveProductModel(model: ProductModel): Promise<void> {
    const models = await this.getProductModels();
    const existingIndex = models.findIndex(m => m.id === model.id);
    
    if (existingIndex >= 0) {
      models[existingIndex] = model;
    } else {
      models.push(model);
    }
    
    localStorage.setItem(this.storageKey.models, JSON.stringify(models));
  }

  async deleteProductModel(id: string): Promise<void> {
    const models = await this.getProductModels();
    const filtered = models.filter(m => m.id !== id);
    localStorage.setItem(this.storageKey.models, JSON.stringify(filtered));
  }

  // Production Batches
  async getProductionBatches(): Promise<ProductionBatch[]> {
    this.initializeMockData();
    const data = localStorage.getItem(this.storageKey.batches);
    return data ? JSON.parse(data) : [];
  }

  async saveProductionBatch(batch: ProductionBatch): Promise<void> {
    const batches = await this.getProductionBatches();
    const existingIndex = batches.findIndex(b => b.id === batch.id);
    
    if (existingIndex >= 0) {
      batches[existingIndex] = batch;
    } else {
      batches.push(batch);
    }
    
    localStorage.setItem(this.storageKey.batches, JSON.stringify(batches));
  }

  async updateProductionUnit(unitId: string, updates: Partial<any>): Promise<void> {
    const batches = await this.getProductionBatches();
    
    for (const batch of batches) {
      const unitIndex = batch.units.findIndex(u => u.id === unitId);
      if (unitIndex >= 0) {
        batch.units[unitIndex] = { ...batch.units[unitIndex], ...updates };
        await this.saveProductionBatch(batch);
        break;
      }
    }
  }

  // Label Templates
  async getLabelTemplates(): Promise<LabelTemplate[]> {
    this.initializeMockData();
    const data = localStorage.getItem(this.storageKey.templates);
    return data ? JSON.parse(data) : [];
  }

  async saveLabelTemplate(template: LabelTemplate): Promise<void> {
    const templates = await this.getLabelTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(this.storageKey.templates, JSON.stringify(templates));
  }

  // System Users
  async getSystemUsers(): Promise<SystemUser[]> {
    this.initializeMockData();
    const data = localStorage.getItem(this.storageKey.users);
    return data ? JSON.parse(data) : [];
  }

  async saveSystemUser(user: SystemUser): Promise<void> {
    const users = await this.getSystemUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.storageKey.users, JSON.stringify(users));
  }

  // Statistics and Reports
  async getProductionStats(startDate?: Date, endDate?: Date): Promise<any> {
    const batches = await this.getProductionBatches();
    
    // Фильтрация по дате если указана
    let filteredBatches = batches;
    if (startDate && endDate) {
      filteredBatches = batches.filter(batch => 
        batch.createdAt >= startDate && batch.createdAt <= endDate
      );
    }
    
    const allUnits = filteredBatches.flatMap(batch => batch.units);
    
    return {
      totalUnits: allUnits.length,
      completed: allUnits.filter(u => u.status === 'completed').length,
      inProgress: allUnits.filter(u => u.status === 'in_progress').length,
      planned: allUnits.filter(u => u.status === 'planned').length,
      errors: 0 // Можно добавить логику подсчета ошибок
    };
  }
}

// Экспорт синглтона
export const dataService = new DataService();