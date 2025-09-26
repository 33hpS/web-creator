/**
 * Палитра элементов для добавления на канвас
 * Предлагает кнопки добавления разных типов элементов
 */

import React from 'react';
import { Button } from '../../components/ui/button';
import { useDesignerStore } from './store';
import { BadgePlus, Type, Square, Minus, Image as ImageIcon, QrCode, Barcode } from 'lucide-react';

/** Компонент палитры элементов */
const Palette: React.FC = () => {
  const add = useDesignerStore((s) => s.addElement);

  const items = [
    { key: 'text', label: 'Text', icon: Type },
    { key: 'qr', label: 'QR', icon: QrCode },
    { key: 'barcode', label: 'Barcode', icon: Barcode },
    { key: 'rect', label: 'Rect', icon: Square },
    { key: 'line', label: 'Line', icon: Minus },
    { key: 'image', label: 'Image', icon: ImageIcon },
  ] as const;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <BadgePlus className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700 font-medium">Добавить элемент</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <Button
            key={it.key}
            variant="outline"
            className="justify-start bg-white"
            onClick={() => add(it.key as any)}
          >
            <it.icon className="h-4 w-4 mr-2" />
            {it.label}
          </Button>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-3">
        Подсказка: выделите элемент и используйте Delete (удалить), Ctrl+D (дублировать).
      </div>
    </div>
  );
};

export default Palette;
