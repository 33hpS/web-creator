/**
 * Canvas: центральная область конструктора этикетки.
 * Содержит:
 * - Полотно с сеткой и масштабом
 * - Отрисовку элементов (text, rect, line, image, qr, barcode)
 * - Перемещение и изменение размера с магнитными направляющими
 * - Панель управления (индикатор магнитов, переключатели, зум)
 *
 * Доступность:
 * - role="application" для основной области
 * - role="button" + aria-selected для элементов
 * - Фокусируемые элементы с клавиатурой (стрелки, Delete, Ctrl+D)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDesignerStore } from './store';
import { mmToPx } from './types';
import { Button } from '../../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Separator } from '../../components/ui/separator';
import { Badge } from '../../components/ui/badge';
import { Magnet, Grid, Eye, EyeOff, ZoomIn, ZoomOut, Move } from 'lucide-react';

/** Тип внутреннего состояния перетаскивания */
type DragState =
  | {
      type: 'move';
      id: string;
      prevClientX: number;
      prevClientY: number;
    }
  | {
      type: 'resize';
      id: string;
      prevClientX: number;
      prevClientY: number;
      startW: number;
      startH: number;
      handle: 'se';
    }
  | null;

/** Утилита: вычисляет стили фона сетки на основании шага и масштаба */
function useGridBackground(showGrid: boolean, gridMm: number, zoom: number) {
  return useMemo(() => {
    if (!showGrid) return {};
    const stepPx = Math.max(1, Math.round(mmToPx(gridMm) * zoom));
    const line = 'rgba(0,0,0,0.08)';
    const lineMajor = 'rgba(0,0,0,0.12)';
    // Микс мелкой и крупной сетки (каждая 5-я линия чуть заметнее)
    return {
      backgroundImage: `
        linear-gradient(to right, ${line} 1px, transparent 1px),
        linear-gradient(to bottom, ${line} 1px, transparent 1px),
        linear-gradient(to right, ${lineMajor} 1px, transparent 1px),
        linear-gradient(to bottom, ${lineMajor} 1px, transparent 1px)
      `,
      backgroundSize: `
        ${stepPx}px ${stepPx}px,
        ${stepPx}px ${stepPx}px,
        ${stepPx * 5}px ${stepPx * 5}px,
        ${stepPx * 5}px ${stepPx * 5}px
      `,
    } as React.CSSProperties;
  }, [showGrid, gridMm, zoom]);
}

/** Отрисовка одного элемента в виде примитива */
function ElementPrimitive(props: {
  el: any;
  zoom: number;
  isSelected: boolean;
  onPointerDownMove: (e: React.MouseEvent, id: string) => void;
  onPointerDownResize: (e: React.MouseEvent, id: string) => void;
  onSelect: (id: string) => void;
}) {
  const { el, zoom, isSelected, onPointerDownMove, onPointerDownResize, onSelect } = props;
  const left = mmToPx(el.x) * zoom;
  const top = mmToPx(el.y) * zoom;
  const width = mmToPx(el.w) * zoom;
  const height = mmToPx(el.h) * zoom;

  // Общие стили обводки/заливки
  const stroke = el.stroke || 'transparent';
  const strokeWidth = (el.strokeWidth ?? 1) * zoom; // масштабируем толщину
  const fill = el.fill || 'transparent';
  const opacity = el.opacity ?? 1;

  const commonClasses =
    'absolute select-none rounded-sm transition-shadow transition-transform duration-150 ease-out';
  const hoverShadow = 'hover:shadow-[0_0_0_2px_rgba(59,130,246,0.4)]';
  const selectedRing = isSelected ? 'ring-2 ring-blue-500' : '';

  // Контент по типу
  let content: React.ReactNode = null;

  if (el.type === 'text') {
    const align = el.align || 'left';
    content = (
      <div
        className="w-full h-full flex items-center"
        style={{
          justifyContent: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
          color: el.stroke || '#111',
          fontWeight: el.fontWeight || 'normal',
          fontSize: `${el.fontSize || 12}pt`,
          opacity,
        }}
      >
        <span className="truncate w-full">{el.text || 'Text'}</span>
      </div>
    );
  } else if (el.type === 'line') {
    content = (
      <div
        className="absolute"
        style={{
          left: 0,
          top: height / 2 - Math.max(1, strokeWidth) / 2,
          width: width,
          height: Math.max(1, strokeWidth),
          background: stroke,
          opacity,
        }}
      />
    );
  } else if (el.type === 'rect') {
    content = (
      <div
        className="w-full h-full"
        style={{
          background: fill,
          border: stroke !== 'transparent' ? `${Math.max(1, strokeWidth)}px solid ${stroke}` : undefined,
          opacity,
        }}
      />
    );
  } else if (el.type === 'image') {
    content = (
      <div
        className="w-full h-full flex items-center justify-center text-xs text-gray-600"
        style={{
          background: fill !== 'transparent' ? fill : '#F5F5F5',
          border: stroke !== 'transparent' ? `${Math.max(1, strokeWidth)}px dashed ${stroke}` : undefined,
          opacity,
        }}
      >
        Image
      </div>
    );
  } else if (el.type === 'qr' || el.type === 'barcode') {
    content = (
      <div
        className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 uppercase tracking-widest"
        style={{
          background: fill !== 'transparent' ? fill : '#F7FAFF',
          border: stroke !== 'transparent' ? `${Math.max(1, strokeWidth)}px dashed ${stroke}` : `1px dashed #94A3B8`,
          opacity,
        }}
      >
        {el.type}
      </div>
    );
  }

  return (
    <div
      role="button"
      aria-label={`${el.type}${
        el.type === 'text' && el.dataField ? ` bound to ${el.dataField}` : ''
      }`}
      aria-selected={isSelected}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(el.id);
      }}
      onMouseDown={(e) => onPointerDownMove(e, el.id)}
      className={`${commonClasses} ${hoverShadow} ${selectedRing} group`}
      style={{
        left,
        top,
        width: Math.max(2, width),
        height: Math.max(2, height),
        cursor: 'grab',
      }}
    >
      {/* Бейдж привязки к данным (для текстового элемента) */}
      {el.type === 'text' && el.dataField && (
        <div className="absolute -top-3 left-0 text-[10px] leading-none">
          <span className="bg-green-600 text-white px-1 py-0.5 rounded shadow-sm">
            {`{${el.dataField}}`}
          </span>
        </div>
      )}

      {content}

      {/* Ручка изменения размера (правый-нижний угол) */}
      <button
        aria-label="Resize handle"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPointerDownResize(e, el.id);
        }}
        className="absolute -right-1 -bottom-1 h-3 w-3 rounded-sm bg-white border border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        style={{ cursor: 'nwse-resize' }}
      />
    </div>
  );
}

/** Основной компонент полотна */
const Canvas: React.FC = () => {
  const {
    label,
    elements,
    selectedId,
    setSelected,
    moveElement,
    resizeElement,
    setZoom,
    zoom,
    setCursor,
  } = useDesignerStore();

  const [drag, setDrag] = useState<DragState>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const labelPx = useMemo(
    () => ({
      w: mmToPx(label.widthMm) * zoom,
      h: mmToPx(label.heightMm) * zoom,
    }),
    [label.widthMm, label.heightMm, zoom]
  );

  const gridStyle = useGridBackground(label.showGrid, label.gridMm, zoom);

  /** Начать перемещение */
  const handlePointerDownMove = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (e.button !== 0) return;
      setSelected(id);
      setCursor('grabbing');
      setDrag({ type: 'move', id, prevClientX: e.clientX, prevClientY: e.clientY });
    },
    [setSelected, setCursor]
  );

  /** Начать изменение размера (правый-нижний угол) */
  const handlePointerDownResize = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (e.button !== 0) return;
      const el = elements.find((x) => x.id === id);
      if (!el) return;
      setSelected(id);
      setCursor('nwse-resize');
      setDrag({
        type: 'resize',
        id,
        prevClientX: e.clientX,
        prevClientY: e.clientY,
        startW: el.w,
        startH: el.h,
        handle: 'se',
      });
    },
    [elements, setSelected, setCursor]
  );

  /** Завершить любое действие */
  const endAction = useCallback(() => {
    setDrag(null);
    setCursor('default');
    // очистить визуальные направляющие после окончания перетаскивания
    try {
      (useDesignerStore as any).setState?.({ magneticGuides: [] });
    } catch {}
  }, [setCursor]);

  /** Движение мыши для drag/resize */
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!drag) return;

      const dxPx = e.clientX - drag.prevClientX;
      const dyPx = e.clientY - drag.prevClientY;
      const dxMm = dxPx / (mmToPx(1) * zoom);
      const dyMm = dyPx / (mmToPx(1) * zoom);

      if (drag.type === 'move') {
        moveElement(drag.id, dxMm, dyMm);
        setDrag((prev) =>
          prev && prev.type === 'move'
            ? { ...prev, prevClientX: e.clientX, prevClientY: e.clientY }
            : prev
        );
      } else if (drag.type === 'resize') {
        // простое изменение размера, минимум 1 мм
        const newW = Math.max(1, drag.startW + dxMm);
        const newH = Math.max(0, drag.startH + dyMm); // для line h может быть 0
        resizeElement(drag.id, { w: newW, h: newH });
        setDrag((prev) =>
          prev && prev.type === 'resize'
            ? { ...prev, prevClientX: e.clientX, prevClientY: e.clientY }
            : prev
        );
      }
    }
    function onUp() {
      if (drag) endAction();
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [drag, zoom, moveElement, resizeElement, endAction]);

  /** Горячие клавиши: Delete, Ctrl+D, стрелки */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { deleteSelected, duplicateSelected, updateElement } = useDesignerStore.getState() as any;
      if (!selectedId) return;

      if (e.key === 'Delete') {
        e.preventDefault();
        deleteSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const el = (useDesignerStore.getState() as any).elements.find((x: any) => x.id === selectedId);
        if (!el) return;
        const step = e.shiftKey ? 5 : 1; // шаг в мм
        const patch: any = {};
        if (e.key === 'ArrowUp') patch.y = el.y - step;
        if (e.key === 'ArrowDown') patch.y = el.y + step;
        if (e.key === 'ArrowLeft') patch.x = el.x - step;
        if (e.key === 'ArrowRight') patch.x = el.x + step;
        updateElement(selectedId, patch);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId]);

  /** Переключатели */
  const toggleGrid = useCallback(() => {
    useDesignerStore.setState((s: any) => ({ label: { ...s.label, showGrid: !s.label.showGrid } }));
  }, []);
  const toggleMagnet = useCallback(() => {
    useDesignerStore.setState((s: any) => ({ label: { ...s.label, magneticGuides: !s.label.magneticGuides } }));
  }, []);

  /** Зум */
  const zoomIn = useCallback(() => setZoom(zoom + 0.1), [zoom, setZoom]);
  const zoomOut = useCallback(() => setZoom(zoom - 0.1), [zoom, setZoom]);

  return (
    <TooltipProvider>
      <div
        role="application"
        aria-label="Label designer canvas"
        className="h-full w-full flex flex-col"
      >
        {/* Верхняя панель с индикаторами и управлением */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`gap-1 ${label.magneticGuides ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              aria-live="polite"
              aria-label={`Magnets ${label.magneticGuides ? 'on' : 'off'}`}
              title={`Магниты ${label.magneticGuides ? 'включены' : 'выключены'}`}
            >
              <Magnet className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {label.magneticGuides ? 'Magnet ON' : 'Magnet OFF'}
              </span>
            </Badge>

            <Separator orientation="vertical" className="h-5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleGrid}
                  aria-pressed={label.showGrid}
                  className={`h-8 ${label.showGrid ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  <span className="text-xs">Grid</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Переключить сетку</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMagnet}
                  aria-pressed={label.magneticGuides}
                  className={`h-8 ${label.magneticGuides ? 'bg-red-50 border-red-300 text-red-700' : ''}`}
                >
                  <Magnet className="h-4 w-4 mr-1" />
                  <span className="text-xs">Magnet</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Переключить магнитные направляющие</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">
              {label.widthMm}×{label.heightMm} мм
            </div>
            <Separator orientation="vertical" className="h-5" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={zoomOut} aria-label="Zoom out" className="h-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Уменьшить масштаб</TooltipContent>
            </Tooltip>
            <div className="text-xs w-12 text-center font-medium">{Math.round(zoom * 100)}%</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={zoomIn} aria-label="Zoom in" className="h-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Увеличить масштаб</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Область прокрутки с полотном */}
        <div className="relative flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-slate-100">
          {/* Центрирование полотна */}
          <div className="min-w-full min-h-full flex items-center justify-center p-6">
            {/* Стол (рабочая область) */}
            <div
              ref={stageRef}
              className="relative rounded-md shadow-md"
              style={{
                width: Math.max(60, labelPx.w),
                height: Math.max(40, labelPx.h),
                backgroundColor: '#fff',
                ...(gridStyle as any),
                cursor: drag?.type === 'move' ? 'grabbing' : drag?.type === 'resize' ? 'nwse-resize' : 'default',
              }}
              onMouseDown={() => setSelected(null)}
            >
              {/* Подсказка по пустому полотну */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Move className="h-4 w-4" />
                    Перетащите элементы из палитры
                  </div>
                </div>
              )}

              {/* Элементы */}
              {elements
                .slice()
                .sort((a: any, b: any) => (a.z ?? 0) - (b.z ?? 0))
                .map((el: any) => (
                  <ElementPrimitive
                    key={el.id}
                    el={el}
                    zoom={zoom}
                    isSelected={selectedId === el.id}
                    onPointerDownMove={handlePointerDownMove}
                    onPointerDownResize={handlePointerDownResize}
                    onSelect={setSelected}
                  />
                ))}

              {/* Визуальные магнитные направляющие */}
              {useDesignerStore.getState().magneticGuides?.map((g: any, idx: number) => {
                const posPx = mmToPx(g.position) * zoom;
                const common = 'absolute bg-red-500/70';
                return g.type === 'vertical' ? (
                  <div
                    key={`vg-${idx}`}
                    className={`${common}`}
                    style={{ left: posPx, top: 0, width: 1, height: '100%' }}
                    aria-hidden="true"
                  />
                ) : (
                  <div
                    key={`hg-${idx}`}
                    className={`${common}`}
                    style={{ top: posPx, left: 0, height: 1, width: '100%' }}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Нижняя информационная полоска */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t bg-white text-[11px] text-gray-600">
          <div className="flex items-center gap-3">
            <span>
              Сетка: <strong>{label.showGrid ? 'вкл' : 'выкл'}</strong>
            </span>
            <span>
              Магниты: <strong>{label.magneticGuides ? 'вкл' : 'выкл'}</strong>
            </span>
          </div>
          <div className="text-gray-500">
            Подсказки: перетаскивайте ЛКМ; Resize — угол; Delete — удалить; Ctrl+D — дублировать
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Canvas;
