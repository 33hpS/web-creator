/**
 * Типы данных для сущностей системы СУПиМ
 */

export interface ProductModel {
  id: string;
  name: string;
  sku: string;
  dimensions: string;
  materialType: string;
  colorOptions: string[];
  defaultLabelTemplateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionUnit {
  id: string;
  modelId: string;
  modelName: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  uuid: string;
  createdAt: Date;
  completedAt?: Date;
  finalLabelPrinted?: boolean;
}

export interface ProductionBatch {
  id: string;
  modelId: string;
  quantity: number;
  units: ProductionUnit[];
  status: 'planned' | 'in_progress' | 'completed';
  createdAt: Date;
  createdBy: string;
}

export interface LabelTemplate {
  id: string;
  name: string;
  content: string;
  width: number;
  height: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'worker';
  isActive: boolean;
  createdAt: Date;
}