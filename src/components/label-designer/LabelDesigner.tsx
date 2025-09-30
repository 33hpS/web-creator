/**
 * Компоновка конструктора: левая палитра, центр-канвас, правая панель
 * Использует react-resizable-panels (PanelGroup, Panel, PanelResizeHandle)
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useDesignerStore } from './store';
import Palette from './Palette';
import Canvas from './Canvas';
import Inspector from './Inspector';
import PrintPreview from './PrintPreview';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '../../components/ui/button';
import { Printer } from 'lucide-react';

export interface LabelDesignerRef {
  /** Возвращает сериализуемые данные шаблона */
  exportData: () => { label: any; elements: any[] };
  /** Загрузить данные шаблона в редактор */
  loadData: (data: { label: any; elements: any[] }) => void;
  /** Очистить */
  clear: () => void;
}

/**
 * Главный компонент конструктора этикеток.
 * Внутри: PanelGroup с тремя панелями и двумя ресайз-хэндлами.
 */
const LabelDesigner = forwardRef<LabelDesignerRef, {}>((_props, ref) => {
  const exportData = useDesignerStore((s) => s.exportData);
  const loadFromData = useDesignerStore((s) => s.loadFromData);
  const clear = useDesignerStore((s) => s.clear);

  useImperativeHandle(ref, () => ({
    exportData,
    loadData: loadFromData,
    clear,
  }));

  /** Mount shield to prevent ghost-click from opening print preview immediately after navigation */
  const [mountShield, setMountShield] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setMountShield(false), 2000); // Увеличиваем до 2 секунд
    return () => clearTimeout(t);
  }, []);

  return (
    <Card className="h-[calc(100vh-200px)]">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Конструктор этикетки</CardTitle>
          <PrintPreview>
            <Button
              variant="outline"
              className={`bg-white ${mountShield ? 'pointer-events-none opacity-60' : ''}`}
              disabled={mountShield}
              tabIndex={mountShield ? -1 : 0}
              aria-disabled={mountShield}
            >
              <Printer className="h-4 w-4 mr-2" />
              Предпросмотр печати
            </Button>
          </PrintPreview>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        {/* Горизонтальная группа панелей: палитра — канвас — инспектор */}
        <PanelGroup direction="horizontal" className="h-full">
          {/* Левая панель (палитра) */}
          <Panel defaultSize={22} minSize={16}>
            <div className="h-full border-r p-3 bg-white">
              <Palette />
            </div>
          </Panel>

          {/* Хэндл ресайза с видимым указателем */}
          <PanelResizeHandle className="relative w-2 bg-gray-200 hover:bg-gray-300 transition-colors">
            <div className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400" />
          </PanelResizeHandle>

          {/* Центральная панель (канвас) */}
          <Panel defaultSize={56} minSize={40}>
            <Canvas />
          </Panel>

          {/* Хэндл ресайза с видимым указателем */}
          <PanelResizeHandle className="relative w-2 bg-gray-200 hover:bg-gray-300 transition-colors">
            <div className="absolute left-1/2 top-1/2 h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-400" />
          </PanelResizeHandle>

          {/* Правая панель (инспектор) */}
          <Panel defaultSize={22} minSize={18}>
            <div className="h-full border-l bg-white">
              <Inspector />
            </div>
          </Panel>
        </PanelGroup>
      </CardContent>
    </Card>
  );
});

LabelDesigner.displayName = 'LabelDesigner';

export default LabelDesigner;