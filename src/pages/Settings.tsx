/**
 * Модуль системных настроек (только для администратора)
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Settings, Save, Printer, Database, Shield, Bell, Network } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { authState } = useAuth();
  const [settings, setSettings] = useState({
    // Настройки принтера
    printer: {
      name: 'Zebra GK420t',
      ipAddress: '192.168.1.100',
      port: 9100,
      labelWidth: 100,
      labelHeight: 60,
      isEnabled: true
    },
    // Настройки системы
    system: {
      autoBackup: true,
      backupInterval: 24,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
      notifications: true
    },
    // Настройки интеграции
    integration: {
      apiEnabled: true,
      apiKey: 'supim_' + Math.random().toString(36).substr(2, 9),
      syncInterval: 30,
      logLevel: 'info'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Имитация сохранения настроек
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // В реальной реализации здесь будет вызов API
    alert('Настройки успешно сохранены');
  };

  const testPrinterConnection = async () => {
    // Заглушка для тестирования подключения к принтеру
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('Подключение к принтеру успешно проверено');
  };

  const generateNewApiKey = () => {
    setSettings(prev => ({
      ...prev,
      integration: {
        ...prev.integration,
        apiKey: 'supim_' + Math.random().toString(36).substr(2, 9)
      }
    }));
  };

  if (authState.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>
              Только администраторы могут изменять системные настройки
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Системные настройки</h1>
                <p className="text-gray-600">Конфигурация параметров системы СУПиМ</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Настройки принтера */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Настройки принтера
              </CardTitle>
              <CardDescription>Конфигурация принтера для печати этикеток</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerName">Название принтера</Label>
                  <Input
                    id="printerName"
                    value={settings.printer.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      printer: { ...prev.printer, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printerIP">IP-адрес принтера</Label>
                  <Input
                    id="printerIP"
                    value={settings.printer.ipAddress}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      printer: { ...prev.printer, ipAddress: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerPort">Порт</Label>
                  <Input
                    id="printerPort"
                    type="number"
                    value={settings.printer.port}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      printer: { ...prev.printer, port: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelWidth">Ширина этикетки (мм)</Label>
                  <Input
                    id="labelWidth"
                    type="number"
                    value={settings.printer.labelWidth}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      printer: { ...prev.printer, labelWidth: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labelHeight">Высота этикетки (мм)</Label>
                  <Input
                    id="labelHeight"
                    type="number"
                    value={settings.printer.labelHeight}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      printer: { ...prev.printer, labelHeight: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="printerEnabled" className="text-base">Принтер включен</Label>
                  <p className="text-sm text-gray-600">Разрешить печать этикеток</p>
                </div>
                <Switch
                  id="printerEnabled"
                  checked={settings.printer.isEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    printer: { ...prev.printer, isEnabled: checked }
                  }))}
                />
              </div>

              <Button variant="outline" onClick={testPrinterConnection} className="bg-transparent">
                <Network className="h-4 w-4 mr-2" />
                Проверить подключение
              </Button>
            </CardContent>
          </Card>

          {/* Настройки системы */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Настройки системы
              </CardTitle>
              <CardDescription>Общие параметры работы системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup" className="text-base">Автоматическое резервное копирование</Label>
                  <p className="text-sm text-gray-600">Создавать резервные копии данных</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.system.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, autoBackup: checked }
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupInterval">Интервал резервного копирования (часы)</Label>
                  <Input
                    id="backupInterval"
                    type="number"
                    value={settings.system.backupInterval}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, backupInterval: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Макс. попыток входа</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.system.maxLoginAttempts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      system: { ...prev.system, maxLoginAttempts: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">Уведомления</Label>
                  <p className="text-sm text-gray-600">Показывать системные уведомления</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.system.notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, notifications: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки интеграции */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Настройки интеграции и API
              </CardTitle>
              <CardDescription>Параметры внешних интеграций и API доступа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="apiEnabled" className="text-base">API включено</Label>
                  <p className="text-sm text-gray-600">Разрешить доступ к API системы</p>
                </div>
                <Switch
                  id="apiEnabled"
                  checked={settings.integration.apiEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    integration: { ...prev.integration, apiEnabled: checked }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API ключ</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiKey"
                    value={settings.integration.apiKey}
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={generateNewApiKey} className="bg-transparent">
                    Сгенерировать новый
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Используйте этот ключ для доступа к API системы</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Интервал синхронизации (минуты)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={settings.integration.syncInterval}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      integration: { ...prev.integration, syncInterval: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Уровень логирования</Label>
                  <Select 
                    value={settings.integration.logLevel}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      integration: { ...prev.integration, logLevel: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Только ошибки</SelectItem>
                      <SelectItem value="warn">Предупреждения</SelectItem>
                      <SelectItem value="info">Информация</SelectItem>
                      <SelectItem value="debug">Отладка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Опасные настройки */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Опасные настройки
              </CardTitle>
              <CardDescription className="text-red-600">
                Действия, которые могут повлиять на работу системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Очистка кеша системы</p>
                  <p className="text-sm text-red-600">Удалить временные файлы и данные кеша</p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Очистить кеш
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Сброс статистики</p>
                  <p className="text-sm text-red-600">Обнулить всю статистику производства</p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Сбросить статистику
                </Button>
              </div>

              <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-red-600">Экспорт всех данных</p>
                  <p className="text-sm text-red-600">Скачать полную базу данных системы</p>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Экспортировать данные
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;