/**
 * Страница "Шаблоны": список шаблонов и конструктор.
 * Печать: скрываем панели управления и список, оставляем саму рабочую область (если потребуется).
 * Для стандартной печати рекомендуется использовать встроенный PrintPreview конструктора.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { dataService } from '../services/dataService';
import { LabelTemplate } from '../types/entities';
import LabelDesigner, { LabelDesignerRef } from '../components/label-designer/LabelDesigner';
import { Plus, Save, FileText, Loader2, Copy, Trash2, RotateCw } from 'lucide-react';
import { PrintOnly } from '../components/print/Visibility';

const TemplatesPage: React.FC = () => {
  const ref = useRef<LabelDesignerRef>(null);

  const [templates, setTemplates] = useState<LabelTemplate[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState<string>('Новый шаблон');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    setLoading(true);
    const list = await dataService.getLabelTemplates();
    setTemplates(list);
    setLoading(false);
  };

  useEffect(() => {
    loadList();
  }, []);

  const loadTemplate = async (t: LabelTemplate) => {
    setCurrentId(t.id);
    setName(t.name);
    try {
      const data = JSON.parse(t.content);
      ref.current?.loadData(data);
    } catch {
      // старые строковые шаблоны — сбрасываем на дефолт
      ref.current?.clear();
    }
  };

  const newTemplate = () => {
    setCurrentId(null);
    setName('Новый шаблон');
    ref.current?.clear();
  };

  const saveTemplate = async () => {
    if (!ref.current) return;
    setIsSaving(true);
    const data = ref.current.exportData();
    const payload: LabelTemplate = {
      id: currentId || Date.now().toString(),
      name: name || 'Без названия',
      content: JSON.stringify(data),
      width: data.label.widthMm,
      height: data.label.heightMm,
      isDefault: false,
      createdAt: new Date(),
    };
    await dataService.saveLabelTemplate(payload);
    await loadList();
    setCurrentId(payload.id);
    setIsSaving(false);
  };

  const duplicate = async () => {
    if (!ref.current) return;
    const data = ref.current.exportData();
    const payload: LabelTemplate = {
      id: Date.now().toString(),
      name: `${name} (копия)`,
      content: JSON.stringify(data),
      width: data.label.widthMm,
      height: data.label.heightMm,
      isDefault: false,
      createdAt: new Date(),
    };
    await dataService.saveLabelTemplate(payload);
    await loadList();
  };

  const remove = async () => {
    if (!currentId) return;
    const filtered = templates.filter((t) => t.id !== currentId);
    localStorage.setItem('supim_label_templates', JSON.stringify(filtered));
    await loadList();
    newTemplate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header hidden on print */}
      <header className="bg-white border-b no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Шаблоны этикеток</h1>
              <p className="text-gray-600">Конструктор в стиле draw.io — создавайте и редактируйте макеты</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white" onClick={newTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Новый
              </Button>
              <Button variant="outline" className="bg-white" onClick={duplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Дублировать
              </Button>
              <Button variant="outline" className="bg-white text-red-600 border-red-200 hover:bg-red-50" onClick={remove}>
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
              <Button onClick={saveTemplate} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="print-area print-clean grayscale-on-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Print header (visible only on print) */}
        <PrintOnly className="mb-4">
          <div>
            <h1 className="text-xl font-bold">Шаблоны этикеток</h1>
            <p className="text-sm">
              Текущий шаблон: {name || '—'} • {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
        </PrintOnly>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Список шаблонов — скрыть в печати */}
          <Card className="lg:col-span-1 h-[calc(100vh-200px)] no-print">
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" /> Список шаблонов
              </CardTitle>
              <CardDescription>Хранится локально (demo)</CardDescription>
            </CardHeader>
            <CardContent className="h-full overflow-auto p-0">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">Загрузка...</div>
              ) : templates.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">Пока нет шаблонов</div>
              ) : (
                <ul className="divide-y">
                  {templates.map((t) => (
                    <li
                      key={t.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${currentId === t.id ? 'bg-blue-50' : ''}`}
                      onClick={() => loadTemplate(t)}
                    >
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">
                        {t.width}×{t.height} мм
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Редактор */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="no-print">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="tplName">Название шаблона</Label>
                    <Input id="tplName" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Текущий ID</Label>
                    <Input readOnly value={currentId || '—'} className="bg-gray-50" />
                  </div>
                  <div className="space-y-1">
                    <Label>Действия</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-white" onClick={() => ref.current?.clear()}>
                        <RotateCw className="h-4 w-4 mr-2" />
                        Очистить полотно
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Сам LabelDesigner может быть сложным для прямой печати.
                Для корректной печати используйте кнопку "Предпросмотр печати" внутри него. */}
            <LabelDesigner ref={ref} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplatesPage;