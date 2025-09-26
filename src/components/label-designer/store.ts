/**
 * Zustand-хранилище для конструктора этикеток
 * Держит элементы, конфиг макета, выделение, масштаб и операции редактирования
 */

import { create } from 'zustand';
import { LabelConfig, LabelElement, TemplateData, MagneticGuide, uid, snapMm, mmToPx } from './types';

interface DesignerState {
  label: LabelConfig;
  elements: LabelElement[];
  selectedId: string | null;
  zoom: number;
  magneticGuides: MagneticGuide[];
  currentCursor: string;

  // Actions
  setLabel: (patch: Partial<LabelConfig>) => void;
  setZoom: (z: number) => void;
  setSelected: (id: string | null) => void;
  setCursor: (cursor: string) => void;

  addElement: (type: LabelElement['type']) => void;
  updateElement: (id: string, patch: Partial<LabelElement>) => void;
  moveElement: (id: string, dxMm: number, dyMm: number) => void;
  resizeElement: (id: string, patch: Partial<Pick<LabelElement, 'x'|'y'|'w'|'h'>>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;

  // Магнитные направляющие
  calculateMagneticGuides: (movingElementId?: string) => MagneticGuide[];
  snapToGuides: (x: number, y: number, w: number, h: number, movingElementId?: string) => { x: number; y: number; guides: MagneticGuide[] };

  loadFromData: (data: TemplateData) => void;
  exportData: () => TemplateData;
  clear: () => void;
}

const defaultConfig: LabelConfig = {
  widthMm: 100,
  heightMm: 60,
  gridMm: 2,
  showGrid: true,
  orientation: 'landscape',
  magneticGuides: true,
  snapThreshold: 2
};

export const useDesignerStore = create<DesignerState>((set, get) => ({
  label: defaultConfig,
  elements: [],
  selectedId: null,
  zoom: 1,
  magneticGuides: [],
  currentCursor: 'default',

  setLabel: (patch) => set((s) => ({ label: { ...s.label, ...patch } })),
  setZoom: (z) => set(() => ({ zoom: Math.min(3, Math.max(0.25, z)) })),
  setSelected: (id) => set(() => ({ selectedId: id })),
  setCursor: (cursor) => set(() => ({ currentCursor: cursor })),

  addElement: (type) =>
    set((s) => {
      const id = uid(type);
      const base = { id, type, x: 5, y: 5, w: 30, h: 10, z: (s.elements.at(-1)?.z ?? 0) + 1, opacity: 1 } as LabelElement;

      let el: LabelElement = base;
      if (type === 'text') {
        el = { ...(base as any), type: 'text', text: 'Текст', fontSize: 12, w: 40, h: 12, align: 'left' };
      }
      if (type === 'line') {
        el = { ...base, type: 'line', h: 0, w: 40, stroke: '#111', strokeWidth: 1 };
      }
      if (type === 'rect') {
        el = { ...base, type: 'rect', fill: '#0000000D', stroke: '#111', strokeWidth: 1 };
      }
      if (type === 'qr' || type === 'barcode' || type === 'image') {
        el = { ...base, type, fill: '#00000010' };
        if (type === 'image') (el as any).objectFit = 'contain';
      }

      return { elements: [...s.elements, el], selectedId: id };
    }),

  updateElement: (id, patch) =>
    set((s) => ({ elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

  moveElement: (id, dxMm, dyMm) =>
    set((s) => {
      const { label, magneticGuides } = s;
      const element = s.elements.find(e => e.id === id);
      if (!element) return {};

      let newX = element.x + dxMm;
      let newY = element.y + dyMm;

      // Привязка к сетке
      if (label.showGrid) {
        newX = snapMm(newX, label.gridMm);
        newY = snapMm(newY, label.gridMm);
      }

      // Магнитные направляющие
      if (label.magneticGuides) {
        const snapped = s.snapToGuides(newX, newY, element.w, element.h, id);
        newX = snapped.x;
        newY = snapped.y;
      }

      return {
        elements: s.elements.map((e) => e.id === id ? { ...e, x: newX, y: newY } : e),
        magneticGuides: label.magneticGuides ? s.calculateMagneticGuides(id) : []
      };
    }),

  resizeElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),

  deleteSelected: () =>
    set((s) => ({ elements: s.elements.filter((e) => e.id !== s.selectedId), selectedId: null })),

  duplicateSelected: () =>
    set((s) => {
      const src = s.elements.find((e) => e.id === s.selectedId);
      if (!src) return {};
      const copy = { ...src, id: uid(src.type), x: src.x + 3, y: src.y + 3, z: (src.z ?? 0) + 1 } as LabelElement;
      return { elements: [...s.elements, copy], selectedId: copy.id };
    }),

  bringForward: () =>
    set((s) => {
      const id = s.selectedId;
      if (!id) return {};
      const maxZ = Math.max(...s.elements.map((e) => e.z ?? 0), 0);
      return { elements: s.elements.map((e) => (e.id === id ? { ...e, z: maxZ + 1 } as LabelElement : e)) };
    }),

  sendBackward: () =>
    set((s) => {
      const id = s.selectedId;
      if (!id) return {};
      const minZ = Math.min(...s.elements.map((e) => e.z ?? 0), 0);
      return { elements: s.elements.map((e) => (e.id === id ? { ...e, z: minZ - 1 } as LabelElement : e)) };
    }),

  // Расчет магнитных направляющих
  calculateMagneticGuides: (movingElementId?: string) => {
    const { elements, label } = get();
    const guides: MagneticGuide[] = [];
    const threshold = label.snapThreshold;

    const movingElement = movingElementId ? elements.find(e => e.id === movingElementId) : null;
    const otherElements = elements.filter(e => !movingElementId || e.id !== movingElementId);

    // Проверяем выравнивание по краям
    otherElements.forEach(element => {
      const edges = [
        { pos: element.x, type: 'vertical' as const, elementId: element.id }, // левый край
        { pos: element.x + element.w, type: 'vertical' as const, elementId: element.id }, // правый край
        { pos: element.y, type: 'horizontal' as const, elementId: element.id }, // верхний край
        { pos: element.y + element.h, type: 'horizontal' as const, elementId: element.id }, // нижний край
        { pos: element.x + element.w / 2, type: 'vertical' as const, elementId: element.id }, // центр по X
        { pos: element.y + element.h / 2, type: 'horizontal' as const, elementId: element.id }, // центр по Y
      ];

      edges.forEach(edge => {
        if (movingElement) {
          const movingEdges = [
            movingElement.x, movingElement.x + movingElement.w, movingElement.y, movingElement.y + movingElement.h,
            movingElement.x + movingElement.w / 2, movingElement.y + movingElement.h / 2
          ];

          movingEdges.forEach(movingEdge => {
            if (Math.abs(movingEdge - edge.pos) <= threshold) {
              const existingGuide = guides.find(g => g.type === edge.type && Math.abs(g.position - edge.pos) <= 0.1);
              if (existingGuide) {
                if (!existingGuide.elements.includes(edge.elementId)) {
                  existingGuide.elements.push(edge.elementId);
                }
                if (!existingGuide.elements.includes(movingElement.id)) {
                  existingGuide.elements.push(movingElement.id);
                }
              } else {
                guides.push({
                  type: edge.type,
                  position: edge.pos,
                  elements: [edge.elementId, movingElement.id]
                });
              }
            }
          });
        }
      });
    });

    return guides;
  },

  // Привязка к направляющим
  snapToGuides: (x: number, y: number, w: number, h: number, movingElementId?: string) => {
    const { label, elements } = get();
    if (!label.magneticGuides) return { x, y, guides: [] };

    const guides = get().calculateMagneticGuides(movingElementId);
    const threshold = label.snapThreshold;
    let newX = x;
    let newY = y;

    guides.forEach(guide => {
      if (guide.type === 'vertical') {
        const edges = [x, x + w, x + w / 2];
        edges.forEach(edge => {
          if (Math.abs(edge - guide.position) <= threshold) {
            newX = guide.position - (edge === x + w ? w : edge === x + w / 2 ? w / 2 : 0);
          }
        });
      } else {
        const edges = [y, y + h, y + h / 2];
        edges.forEach(edge => {
          if (Math.abs(edge - guide.position) <= threshold) {
            newY = guide.position - (edge === y + h ? h : edge === y + h / 2 ? h / 2 : 0);
          }
        });
      }
    });

    return { x: newX, y: newY, guides };
  },

  loadFromData: (data) => set(() => ({ label: data.label, elements: data.elements, selectedId: null, zoom: 1, magneticGuides: [] })),

  exportData: () => {
    const { label, elements } = get();
    return { label, elements };
  },

  clear: () => set(() => ({ label: defaultConfig, elements: [], selectedId: null, zoom: 1, magneticGuides: [] })),
}));