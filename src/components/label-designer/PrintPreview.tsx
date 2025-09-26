/**
 * Компонент предпросмотра печати для термопринтера (управляемый диалог)
 * - Управляемое состояние `open` исключает случайное открытие (ghost click/keyup).
 * - "Армирование" клика после монтирования (armed) блокирует первые события (~500 мс).
 * - Сохраняет прежний UI и горячие действия (масштаб, сетка, скачивание, печать).
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useDesignerStore } from './store';
import { mmToPx } from './types';
import { Printer, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PrintPreviewProps {
  /** Необязательная кастомная кнопка-триггер; обработчик клика будет внедрён. */
  children?: React.ReactNode;
}

/** Настройки термопринтера (ограничения и пресеты) */
const THERMAL_PRINTER_SETTINGS = {
  dpi: 203, // 8 dots/mm
  maxWidth: 104, // мм
  colors: ['#000000', '#FFFFFF'],
  supportedSizes: [
    { width: 50, height: 30, name: '50x30 мм' },
    { width: 60, height: 40, name: '60x40 мм' },
    { width: 80, height: 50, name: '80x50 мм' },
    { width: 100, height: 60, name: '100x60 мм' },
    { width: 104, height: 70, name: '104x70 мм' }
  ]
};

/**
 * PrintPreview (управляемый)
 * - Диалог открывается только по явному клику после "армирования".
 * - Исключает ложные срабатывания при переходе между страницами и залипании клавиш.
 */
const PrintPreview: React.FC<PrintPreviewProps> = ({ children }) => {
  const { label, elements, exportData } = useDesignerStore();

  // UI состояния
  const [zoom, setZoom] = React.useState(1);
  const [showGuidelines, setShowGuidelines] = React.useState(true);

  // Управление диалогом
  const [open, setOpen] = React.useState(false);

  // Армирование (разрешаем открытие только по "чистому" клику спустя 500 мс)
  const [armed, setArmed] = React.useState(false);
  React.useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  // Совместимость с принтером
  const isCompatible = label.widthMm <= THERMAL_PRINTER_SETTINGS.maxWidth;
  const recommendedSize = THERMAL_PRINTER_SETTINGS.supportedSizes.find(
    size => size.width === label.widthMm && size.height === label.heightMm
  );

  /** Скачивание JSON шаблона */
  const downloadTemplate = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `этикетка_${label.widthMm}x${label.heightMm}мм_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Рендер простых элементов в предпросмотр.
   * Важно: только визуализация сетки и плейсхолдеров — печать в монохроме.
   */
  const renderElement = (el: any) => {
    const left = mmToPx(el.x) * zoom;
    const top = mmToPx(el.y) * zoom;
    const width = mmToPx(el.w) * zoom;
    const height = mmToPx(el.h) * zoom;

    const baseStyle = {
      left,
      top,
      width: Math.max(2, width),
      height: Math.max(2, height),
      position: 'absolute' as const,
      border: '1px dashed #666',
      backgroundColor: el.fill || 'transparent',
      color: el.stroke || '#000',
      fontSize: el.type === 'text' ? `${(el.fontSize || 12) * zoom}pt` : 'inherit',
      fontWeight: el.type === 'text' ? el.fontWeight : 'normal',
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        el.type === 'text'
          ? el.align === 'left'
            ? 'flex-start'
            : el.align === 'center'
              ? 'center'
              : 'flex-end'
          : 'center',
      padding: '2px',
      overflow: 'hidden'
    } as React.CSSProperties;

    switch (el.type) {
      case 'text':
        return (
          <div style={baseStyle}>
            <span
              style={{
                color: '#000',
                background: 'transparent',
                fontSize: `${(el.fontSize || 12) * zoom}pt`,
                fontWeight: el.fontWeight || 'normal'
              }}
            >
              {el.text}
            </span>
          </div>
        );

      case 'rect':
        return <div style={{ ...baseStyle, backgroundColor: '#f0f0f0', border: '1px solid #000' }} />;

      case 'line':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#000',
              height: Math.max(1, (el.strokeWidth || 1) * zoom)
            }}
          />
        );

      case 'qr':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#f8f8f8',
              border: '1px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${8 * zoom}px`,
              color: '#000'
            }}
          >
            QR CODE
          </div>
        );

      case 'barcode':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#f8f8f8',
              border: '1px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${8 * zoom}px`,
              color: '#000'
            }}
          >
            BARCODE
          </div>
        );

      case 'image':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#f8f8f8',
              border: '1px dashed #666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${8 * zoom}px`,
              color: '#666'
            }}
          >
            IMAGE
          </div>
        );

      default:
        return null;
    }
  };

  /** Рендер триггера: клонируем переданную кнопку или даём дефолтную */
  const renderTrigger = () => {
    if (children && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const prevOnClick = child.props?.onClick;

      const mergedClass = `${child.props?.className || ''} ${!armed ? 'pointer-events-none opacity-60' : ''}`.trim();

      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!armed) {
            e.preventDefault();
            return;
          }
          setOpen(true);
          prevOnClick?.(e);
        },
        'aria-disabled': !armed ? true : undefined,
        disabled: child.props?.disabled || !armed,
        className: mergedClass
      });
    }

    return (
      <Button
        variant="outline"
        className={`bg-white ${!armed ? 'pointer-events-none opacity-60' : ''}`}
        disabled={!armed}
        onClick={() => setOpen(true)}
      >
        <Printer className="h-4 w-4 mr-2" />
        Предпросмотр печати
      </Button>
    );
  };

  return (
    <TooltipProvider>
      {/* Триггер (вне Dialog), т.к. диалог управляемый */}
      <div className="inline-block">{renderTrigger()}</div>

      {/* Управляемый диалог: игнорируем попытки открыть до "армирования" */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!armed && v) return; // Не открываем пока не "вооружились"
          setOpen(v);
        }}
      >
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Предпросмотр печати для термопринтера</span>
              <div className="flex items-center gap-2">
                <Badge variant={isCompatible ? 'default' : 'destructive'}>
                  {isCompatible ? '✓ Совместимо' : '⚠ Превышает ширину'}
                </Badge>
                {recommendedSize && <Badge variant="secondary">{recommendedSize.name}</Badge>}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4">
            {/* Панель управления предпросмотром */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom((prev) => Math.max(0.25, prev - 0.25))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Уменьшить масштаб</TooltipContent>
                </Tooltip>

                <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom((prev) => Math.min(3, prev + 0.25))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Увеличить масштаб</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Сбросить масштаб (100%)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGuidelines((s) => !s)}
                      className={showGuidelines ? 'bg-blue-50' : ''}
                    >
                      📏 {showGuidelines ? 'Скрыть сетку' : 'Показать сетку'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Переключить отображение направляющих</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={downloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Скачать шаблон
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Скачать JSON-файл шаблона</TooltipContent>
                </Tooltip>

                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Печать...
                </Button>
              </div>
            </div>

            {/* Область предпросмотра */}
            <div className="flex-1 bg-gray-100 rounded-lg p-6 flex items-center justify-center overflow-auto">
              <div
                className="bg-white shadow-lg relative"
                style={{
                  width: mmToPx(label.widthMm) * zoom,
                  height: mmToPx(label.heightMm) * zoom,
                  backgroundImage: showGuidelines
                    ? `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `
                    : 'none',
                  backgroundSize: `${mmToPx(5) * zoom}px ${mmToPx(5) * zoom}px`
                }}
              >
                {/* Границы этикетки */}
                <div className="absolute inset-0 border-2 border-dashed border-gray-400 pointer-events-none" />

                {/* Элементы этикетки */}
                {elements
                  .slice()
                  .sort((a: any, b: any) => (a.z ?? 0) - (b.z ?? 0))
                  .map((el: any) => (
                    <div key={el.id}>{renderElement(el)}</div>
                  ))}

                {/* Информация о размерах */}
                <div className="absolute -bottom-8 left-0 text-xs text-gray-600">
                  {label.widthMm} × {label.heightMm} мм
                  {!isCompatible && (
                    <span className="text-red-600 ml-2">
                      (Макс. ширина: {THERMAL_PRINTER_SETTINGS.maxWidth}мм)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Информационная панель */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Разрешение принтера:</strong> {THERMAL_PRINTER_SETTINGS.dpi} DPI
                </div>
                <div>
                  <strong>Макс. ширина:</strong> {THERMAL_PRINTER_SETTINGS.maxWidth} мм
                </div>
                <div>
                  <strong>Режим печати:</strong> Черно-белый термо
                </div>
              </div>

              {!isCompatible && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                  ⚠ Ширина этикетки ({label.widthMm}мм) превышает максимальную поддерживаемую ширину (
                  {THERMAL_PRINTER_SETTINGS.maxWidth}мм). Рекомендуется уменьшить ширину этикетки.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default PrintPreview;