/**
 * Модуль пользователей и управления доступом
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Users, Plus, Edit, Trash2, Shield, User, Factory, Search } from 'lucide-react';
import { SystemUser } from '../types/entities';

const Users: React.FC = () => {
  const { authState, hasPermission } = useAuth();
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      username: 'admin',
      fullName: 'Администратор Системы',
      email: 'admin@supim.ru',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      username: 'manager',
      fullName: 'Менеджер Производства',
      email: 'manager@supim.ru',
      role: 'manager',
      isActive: true,
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      username: 'worker',
      fullName: 'Оператор Линии',
      email: 'worker@supim.ru',
      role: 'worker',
      isActive: true,
      createdAt: new Date('2024-01-03')
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'worker' as 'admin' | 'manager' | 'worker',
    password: '',
    confirmPassword: ''
  });

  const canEdit = hasPermission('admin');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!formData.username || !formData.fullName || !formData.email || !formData.password) return;
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    const newUser: SystemUser = {
      id: Date.now().toString(),
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      isActive: true,
      createdAt: new Date()
    };

    setUsers([...users, newUser]);
    setIsCreating(false);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'worker',
      password: '',
      confirmPassword: ''
    });
  };

  const handleUpdate = () => {
    if (!editingUser || !formData.username || !formData.fullName || !formData.email) return;

    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? {
            ...user,
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role
          }
        : user
    );

    setUsers(updatedUsers);
    setEditingUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'worker',
      password: '',
      confirmPassword: ''
    });
  };

  const handleDelete = (id: string) => {
    if (id === authState.user?.id) {
      alert('Нельзя удалить текущего пользователя');
      return;
    }
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    if (id === authState.user?.id) {
      alert('Нельзя деактивировать текущего пользователя');
      return;
    }
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const startEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: ''
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'manager': return <Factory className="h-4 w-4" />;
      case 'worker': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'worker': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      case 'worker': return 'Работник';
      default: return role;
    }
  };

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>
              Только администраторы могут управлять пользователями
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
              <Users className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
                <p className="text-gray-600">Создание и редактирование учетных записей</p>
              </div>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по имени, логину или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {(isCreating || editingUser) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingUser ? 'Редактирование пользователя' : 'Новый пользователь'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Логин</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Полное имя</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Иван Петров"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@supim.ru"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Роль</Label>
                  <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="worker">Работник</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isCreating && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Введите пароль"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Повторите пароль"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  onClick={editingUser ? handleUpdate : handleCreate}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {editingUser ? 'Сохранить' : 'Создать'}
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingUser(null);
                    setFormData({
                      username: '',
                      fullName: '',
                      email: '',
                      role: 'worker',
                      password: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Список пользователей</CardTitle>
            <CardDescription>Все учетные записи системы ({filteredUsers.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{user.fullName}</p>
                        {!user.isActive && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            Неактивен
                          </span>
                        )}
                        {user.id === authState.user?.id && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Текущий
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {user.username} • {user.email} • {getRoleText(user.role)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Создан: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent"
                      onClick={() => startEdit(user)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Редактировать
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`bg-transparent ${
                        user.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={user.id === authState.user?.id}
                    >
                      {user.isActive ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === authState.user?.id}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Пользователи не найдены</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Users;