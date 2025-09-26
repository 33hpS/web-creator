
/**
 * Типы для системы аутентификации и управления доступом
 */

export type UserRole = 'admin' | 'manager' | 'worker';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  fullName: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
