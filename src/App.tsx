/**
 * App.tsx
 * Main application router. Wraps routes with AuthProvider and uses react-router (web).
 */
import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'

/**
 * Route components
 * Note: We assume these pages exist in the project. If some are optional,
 * you can comment them out temporarily.
 */
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Production from './pages/Production'
import FinalMarking from './pages/FinalMarking'
import Templates from './pages/Templates'
import Reports from './pages/Reports'
import Models from './pages/Models'
import Users from './pages/Users'
import Settings from './pages/Settings'

/**
 * App
 * Provides routing and global auth context.
 */
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* App sections (can be protected with a ProtectedRoute if needed) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/production" element={<Production />} />
          <Route path="/final-marking" element={<FinalMarking />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/models" element={<Models />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
