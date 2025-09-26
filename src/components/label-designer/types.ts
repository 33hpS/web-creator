/**
 * Типы данных для конструктора шаблонов этикеток
 * Описывает элементы, конфиг макета и сериализуемую структуру шаблона
 */

export type ElementType = 'text' | 'qr' | 'barcode' | 'rect' | 'line' | 'image';

export interface LabelConfig {
  /** Ширина этикетки в мм */
  widthMm: number;
  /** Высота этикетки в мм */
  heightMm: number;
  /** Размер шага сетки в мм */
  gridMm: number;
  /** Отрисовывать сетку */
  showGrid: boolean;
  /** Ориентация - только для UI */
  orientation: 'portrait' | 'landscape';
  /** Включить магнитные направляющие */
  magneticGuides: boolean;
  /** Порог притяжения в мм */
  snapThreshold: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  /** Позиция левого верхнего угла в мм */
  x: number;
  y: number;
  /** Размеры в мм (для линии h может быть 0) */
  w: number;
  h: number;
  /** Поворот в градусах */
  r?: number;
  /** Цвет заливки/линии */
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Прозрачность 0..1 */
  opacity?: number;
  /** z-index порядка отрисовки */
  z?: number;
  /** Привязка к данным для текстовых элементов */
  dataField?: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number; // pt
  fontWeight?: 'normal' | 'bold' | 'semibold';
  align?: 'left' | 'center' | 'right';
  /** Шаблон текста с плейсхолдерами */
  template?: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  /** Ссылка (в реальном мире может быть dataURL) */
  src?: string;
  objectFit?: 'contain' | 'cover';
}

export type LabelElement =
  | TextElement
  | ImageElement
  | (BaseElement & { type: 'qr' | 'barcode' | 'rect' | 'line' });

/** Сериализуемая структура шаблона */
export interface TemplateData {
  label: LabelConfig;
  elements: LabelElement[];
}

/** Магнитные направляющие */
export interface MagneticGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  elements: string[]; // ID элементов, которые выровнены по этой направляющей
}

/** Константа для перевода мм в пиксели при 96dpi */
export const MM_TO_PX = 3.78;

/** Утилиты преобразования */
export const mmToPx = (mm: number) => mm * MM_TO_PX;
export const pxToMm = (px: number) => px / MM_TO_PX;

/** Снэп к сетке (мм) */
export const snapMm = (v: number, stepMm: number) => Math.round(v / stepMm) * stepMm;

/** Генерация простого ID */
export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}`;

/** Доступные поля данных для привязки */
export const DATA_FIELDS = [
  { value: 'modelName', label: 'Название модели', example: 'Шкаф-купе "Премиум"' },
  { value: 'sku', label: 'Артикул (SKU)', example: 'SKU-001' },
  { value: 'uuid', label: 'Уникальный ID', example: 'UUID-001-001' },
  { value: 'dimensions', label: 'Габариты', example: '2000x600x500 мм' },
  { value: 'materialType', label: 'Материал', example: 'ЛДСП' },
  { value: 'color', label: 'Цвет', example: 'Белый' },
  { value: 'productionDate', label: 'Дата производства', example: '26.09.2024' },
  { value: 'completionDate', label: 'Дата завершения', example: '27.09.2024' },
  { value: 'operatorName', label: 'Оператор', example: 'Иван Петров' },
  { value: 'batchId', label: 'ID партии', example: 'BATCH-001' }
];