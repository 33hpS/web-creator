import { HashRouter, Route, Routes, Navigate } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import Production from './pages/Production'
import Templates from './pages/Templates'
import Users from './pages/Users'
import FinalMarking from './pages/FinalMarking'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import { UserRole } from './types/auth'
import './styles/tablet-optimization.css'
import './styles/print.css'

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/models" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Models />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production" 
            element={
              <ProtectedRoute>
                <Production />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/templates" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Templates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/final-marking" 
            element={
              <ProtectedRoute>
                <FinalMarking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="/unauthorized" element={<div>Доступ запрещен</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
