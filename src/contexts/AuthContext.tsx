/**
 * AuthContext.tsx
 * Purpose: Provide unified authentication state across the app with compatibility to existing pages.
 * Exposes:
 *  - authState: { user, isAuthenticated, isLoading }
 *  - user, isAuthenticated, loading
 *  - login, logout
 *  - hasPermission(requiredRole?)
 *
 * Notes:
 *  - Accepts flexible login payloads (can include `name` or `fullName`). Normalizes to `fullName`.
 *  - Persists user in localStorage to keep session.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

/** User shape used by the app (flexible to support existing pages) */
export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'manager' | 'worker' | (string & {})
  /** Optional readable name fields */
  fullName?: string
  name?: string
  email?: string
}

/** Internal persisted storage key */
const STORAGE_KEY = 'supim_auth_user'

/** Context value interface, compatible with existing pages */
interface AppAuthContext {
  /** Structured state for legacy usage */
  authState: {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
  }
  /** Direct shortcuts */
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean

  /** Actions */
  login: (u: Partial<AuthUser> & { id: string; username: string; role: AuthUser['role'] }) => void
  logout: () => void
  hasPermission: (requiredRole?: string) => boolean
}

/** React context */
const AuthContext = createContext<AppAuthContext | undefined>(undefined)

/**
 * AuthProvider
 * Wrap around the app to expose the auth state and actions.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  // Simulate quick boot without async loading
  const [loading] = useState(false)

  /** Persist user to localStorage */
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }, [user])

  /**
   * login
   * Normalizes various payload shapes to a consistent user state.
   */
  const login: AppAuthContext['login'] = (u) => {
    const normalized: AuthUser = {
      id: u.id,
      username: u.username,
      role: u.role,
      fullName: u.fullName || u.name || u.username,
      email: u.email,
      name: u.name, // keep pass-through for compatibility if someone reads it
    }
    setUser(normalized)
  }

  /** logout: clear user */
  const logout = () => setUser(null)

  /**
   * hasPermission
   * Admin has access to everything.
   * If requiredRole not provided — allow.
   */
  const hasPermission: AppAuthContext['hasPermission'] = (requiredRole) => {
    if (!requiredRole) return true
    if (!user) return false
    if (user.role === 'admin') return true
    return user.role === (requiredRole as any)
  }

  const value = useMemo<AppAuthContext>(
    () => ({
      authState: {
        user,
        isAuthenticated: !!user,
        isLoading: loading,
      },
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      hasPermission,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth
 * Hook to access auth state and actions.
 */
export function useAuth(): AppAuthContext {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
