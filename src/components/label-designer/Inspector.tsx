/**
 * Правая панель свойств: параметры макета и свойства выделенного элемента
 */

import React from 'react';
import { useDesignerStore } from './store';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { DATA_FIELDS } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const NumberInput: React.FC<{
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  tooltip?: string;
}> = ({ label, value, step = 1, onChange, suffix, tooltip }) => (
  <div className="space-y-1">
    <Label className="text-xs flex items-center gap-1">
      {label}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-gray-400 cursor-help">ⓘ</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </Label>
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value || '0'))}
        step={step}
        className="h-8 transition-colors hover:border-gray-300 focus:border-blue-500"
      />
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
    </div>
  </div>
);

const Inspector: React.FC = () => {
  const { label, setLabel, selectedId, elements, updateElement, deleteSelected, duplicateSelected } =
    useDesignerStore();

  const el = elements.find((e) => e.id === selectedId) as any;

  // Функция для вставки поля данных в текст
  const insertDataField = (fieldName: string) => {
    if (!el || el.type !== 'text') return;
    
    const currentText = el.text || '';
    const newText = currentText + `{${fieldName}}`;
    updateElement(el.id, { 
      text: newText,
      dataField: fieldName 
    } as any);
  };

  return (
    <TooltipProvider>
      <div className="h-full overflow-auto p-4 space-y-6 bg-gray-50">
        {/* Параметры макета */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              ⚙️ Параметры макета
              <Badge variant="outline" className="text-xs">
                {label.widthMm}×{label.heightMm} мм
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumberInput 
                label="Ширина" 
                value={label.widthMm} 
                suffix="мм" 
                onChange={(v) => setLabel({ widthMm: v })}
                tooltip="Ширина этикетки в миллиметрах"
              />
              <NumberInput 
                label="Высота" 
                value={label.heightMm} 
                suffix="мм" 
                onChange={(v) => setLabel({ heightMm: v })}
                tooltip="Высота этикетки в миллиметрах"
              />
              <NumberInput 
                label="Сетка" 
                value={label.gridMm} 
                suffix="мм" 
                onChange={(v) => setLabel({ gridMm: Math.max(1, v) })}
                tooltip="Размер шага сетки в миллиметрах"
              />
              <NumberInput 
                label="Порог магнитов" 
                value={label.snapThreshold} 
                suffix="мм" 
                onChange={(v) => setLabel({ snapThreshold: Math.max(0.5, v) })}
                tooltip="Расстояние для автоматического прилипания"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="orientation" className="text-xs flex items-center gap-1">
                  🧭 Ориентация
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-400 cursor-help">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ориентация полотна для отображения</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={label.orientation} onValueChange={(v) => setLabel({ orientation: v as any })}>
                  <SelectTrigger className="h-8 w-32 transition-colors hover:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">📱 Портрет</SelectItem>
                    <SelectItem value="landscape">🖥️ Альбом</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showGrid" className="text-xs flex items-center gap-1">
                  🎯 Сетка
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-400 cursor-help">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Показать/скрыть сетку для точного позиционирования</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Switch
                  id="showGrid"
                  checked={label.showGrid}
                  onCheckedChange={(checked) => setLabel({ showGrid: checked })}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="magneticGuides" className="text-xs flex items-center gap-1">
                  🧲 Магниты
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-400 cursor-help">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Автоматическое выравнивание элементов</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Switch
                  id="magneticGuides"
                  checked={label.magneticGuides}
                  onCheckedChange={(checked) => setLabel({ magneticGuides: checked })}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Свойства элемента */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              {!el ? '📄 Элемент' : `🔧 ${el.type.charAt(0).toUpperCase() + el.type.slice(1)}`}
              {el && (
                <Badge variant="secondary" className="text-xs">
                  ID: {el.id.slice(-4)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!el ? (
              <div className="text-xs text-gray-500 text-center py-4">
                👆 Нажмите на элемент на полотне для редактирования
              </div>
            ) : (
              <div className="space-y-4">
                {/* Позиция и размер */}
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput 
                    label="Позиция X" 
                    value={el.x} 
                    suffix="мм" 
                    onChange={(v) => updateElement(el.id, { x: v })}
                    tooltip="Позиция по горизонтали"
                  />
                  <NumberInput 
                    label="Позиция Y" 
                    value={el.y} 
                    suffix="мм" 
                    onChange={(v) => updateElement(el.id, { y: v })}
                    tooltip="Позиция по вертикали"
                  />
                  <NumberInput 
                    label="Ширина" 
                    value={el.w} 
                    suffix="мм" 
                    onChange={(v) => updateElement(el.id, { w: Math.max(1, v) })}
                    tooltip="Ширина элемента"
                  />
                  <NumberInput 
                    label="Высота" 
                    value={el.h} 
                    suffix="мм" 
                    onChange={(v) => updateElement(el.id, { h: Math.max(0, v) })}
                    tooltip="Высота элемента"
                  />
                </div>

                {/* Текстовые свойства */}
                {el.type === 'text' && (
                  <>
                    <Separator />
                    
                    <div className="space-y-1">
                      <Label className="text-xs flex items-center gap-1">
                        ✏️ Текст элемента
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-gray-400 cursor-help">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Текстовое содержимое элемента</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        value={el.text}
                        onChange={(e) => updateElement(el.id, { text: e.target.value } as any)}
                        className="h-8 transition-colors hover:border-gray-300 focus:border-blue-500"
                        placeholder="Введите текст..."
                      />
                    </div>
                    
                    {/* Привязка к данным */}
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        🔗 Привязка к данным
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-gray-400 cursor-help">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Вставьте переменные данных, которые будут подставляться при печати</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      
                      <div className="grid grid-cols-2 gap-1">
                        {DATA_FIELDS.slice(0, 4).map((field) => (
                          <Tooltip key={field.value}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-blue-50 hover:bg-blue-100 transition-colors"
                                onClick={() => insertDataField(field.value)}
                              >
                                {field.label}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Пример: {field.example}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      
                      <Select onValueChange={insertDataField}>
                        <SelectTrigger className="h-7 text-xs transition-colors hover:border-gray-300">
                          <SelectValue placeholder="📋 Другие поля..." />
                        </SelectTrigger>
                        <SelectContent>
                          {DATA_FIELDS.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              <div>
                                <div className="font-medium">{field.label}</div>
                                <div className="text-xs text-gray-500">{field.example}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {el.dataField && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                          ✅ Привязано к полю: <strong>{el.dataField}</strong>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <NumberInput
                        label="Размер шрифта"
                        value={el.fontSize}
                        onChange={(v) => updateElement(el.id, { fontSize: v } as any)}
                        suffix="pt"
                        tooltip="Размер текста в пунктах"
                      />
                      <div className="space-y-1">
                        <Label className="text-xs">🎚️ Толщина</Label>
                        <Select
                          value={el.fontWeight || 'normal'}
                          onValueChange={(v) => updateElement(el.id, { fontWeight: v as any } as any)}
                        >
                          <SelectTrigger className="h-8 transition-colors hover:border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Обычный</SelectItem>
                            <SelectItem value="semibold">Полужирный</SelectItem>
                            <SelectItem value="bold">Жирный</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">📐 Выравнивание</Label>
                      <Select value={el.align || 'left'} onValueChange={(v) => updateElement(el.id, { align: v as any } as any)}>
                        <SelectTrigger className="h-8 transition-colors hover:border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">⬅️ Слева</SelectItem>
                          <SelectItem value="center">⏺️ По центру</SelectItem>
                          <SelectItem value="right">➡️ Справа</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Стили */}
                <Separator />
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">🎨 Заливка</Label>
                    <Input
                      type="color"
                      value={el.fill || '#00000000'}
                      onChange={(e) => updateElement(el.id, { fill: e.target.value })}
                      className="h-8 p-1 transition-colors hover:border-gray-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">🖊️ Обводка</Label>
                    <Input
                      type="color"
                      value={el.stroke || '#000000'}
                      onChange={(e) => updateElement(el.id, { stroke: e.target.value })}
                      className="h-8 p-1 transition-colors hover:border-gray-300"
                    />
                  </div>
                  <NumberInput
                    label="Толщина обводки"
                    value={el.strokeWidth ?? 1}
                    onChange={(v) => updateElement(el.id, { strokeWidth: v })}
                    tooltip="Толщина линии обводки"
                  />
                  <NumberInput
                    label="Непрозрачность"
                    value={(el.opacity ?? 1) * 100}
                    onChange={(v) => updateElement(el.id, { opacity: Math.max(0, Math.min(1, v / 100)) })}
                    suffix="%"
                    tooltip="Прозрачность элемента"
                  />
                </div>

                {/* Действия */}
                <Separator />
                
                <div className="flex gap-2 pt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="bg-white hover:bg-gray-50 transition-colors flex-1" onClick={duplicateSelected}>
                        📋 Дублировать
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Создать копию элемента (Ctrl+D)</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="bg-white text-red-600 border-red-200 hover:bg-red-50 transition-colors" onClick={deleteSelected}>
                        🗑️ Удалить
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Удалить элемент (Delete)</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Inspector;