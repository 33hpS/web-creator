
/**
 * Контекст аутентификации для управления состоянием пользователя
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '../types/auth';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock данные для демонстрации
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    fullName: 'Администратор Системы',
    email: 'admin@supim.ru'
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    fullName: 'Менеджер Производства',
    email: 'manager@supim.ru'
  },
  {
    id: '3',
    username: 'worker',
    password: 'worker123',
    role: 'worker',
    fullName: 'Оператор Линии',
    email: 'worker@supim.ru'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true // Загрузка при инициализации для проверки токена
  });

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // В реальном приложении здесь была бы проверка токена на сервере
          // Для демо просто проверяем наличие токена
          const isValid = await validateToken(token);
          
          if (isValid) {
            setAuthState({
              user: JSON.parse(userData),
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            // Токен невалиден, очищаем хранилище
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };
    
    checkAuth();
  }, []);

  // Функция валидации токена (эмуляция)
  const validateToken = async (token: string): Promise<boolean> => {
    // Эмуляция проверки токена
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // В реальном приложении здесь был бы вызов к серверу
    // Для демо считаем токен валидным если он существует
    return token.startsWith('mock_jwt_') || token.length > 10;
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Эмуляция реального API вызова с JWT
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const { user, token } = await response.json();
        
        // Сохранение токена в localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      } else {
        throw new Error('Ошибка аутентификации');
      }
    } catch (error) {
      // Fallback на mock данные при отсутствии бэкенда
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(
        u => u.username === credentials.username && 
        u.password === credentials.password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        const mockToken = `mock_jwt_${Date.now()}`;
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      admin: 3,
      manager: 2,
      worker: 1
    };
    
    return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
