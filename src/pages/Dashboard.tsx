/**
 * Dashboard.tsx
 * Purpose: Entry point for role-based dashboards. Renders specific dashboard by current user role.
 * Compatible with existing Admin/Manager/Worker dashboards.
 */

import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import ManagerDashboard from '../components/dashboard/ManagerDashboard'
import WorkerDashboard from '../components/dashboard/WorkerDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

/**
 * Dashboard
 * Chooses a dashboard based on the authenticated user's role.
 */
export default function Dashboard() {
  const { authState } = useAuth()
  const role = authState.user?.role

  if (!authState.isAuthenticated || !role) {
    // Fallback when no user or not authenticated
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Требуется вход</CardTitle>
            <CardDescription>
              Пожалуйста, войдите в систему, чтобы открыть панель управления
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Перейдите на страницу «Login» и выполните вход.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render dashboard by role
  if (role === 'admin') {
    return <AdminDashboard />
  }
  if (role === 'manager') {
    return <ManagerDashboard />
  }
  // default and 'worker'
  return <WorkerDashboard />
}
