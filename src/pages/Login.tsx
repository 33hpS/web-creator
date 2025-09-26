/**
 * Страница входа в систему
 * Обеспечивает аутентификацию пользователей с валидацией и обработкой ошибок
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Обработка отправки формы входа
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Имитация успешного входа для демонстрации
      // В реальном приложении здесь будет вызов API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Тестовые учетные данные для демонстрации
      if (username === 'admin' && password === 'admin123') {
        login({ 
          id: '1', 
          username: 'admin', 
          role: 'admin',
          name: 'Администратор'
        });
        navigate('/dashboard');
      } else if (username === 'manager' && password === 'manager123') {
        login({ 
          id: '2', 
          username: 'manager', 
          role: 'manager',
          name: 'Менеджер'
        });
        navigate('/dashboard');
      } else if (username === 'worker' && password === 'worker123') {
        login({ 
          id: '3', 
          username: 'worker', 
          role: 'worker',
          name: 'Работник'
        });
        navigate('/dashboard');
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-blue-600 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription className="text-gray-600">
            Введите ваши учетные данные для доступа к системе управления производством
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Имя пользователя
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Введите имя пользователя"
                disabled={loading}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Пароль
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Введите пароль"
                disabled={loading}
                className="h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Вход...</span>
                </div>
              ) : (
                'Войти в систему'
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            <p className="font-medium mb-2">Тестовые учетные записи:</p>
            <div className="space-y-1 text-xs">
              <p><strong>Админ:</strong> admin / admin123</p>
              <p><strong>Менеджер:</strong> manager / manager123</p>
              <p><strong>Работник:</strong> worker / worker123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}