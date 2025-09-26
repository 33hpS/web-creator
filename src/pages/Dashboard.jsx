import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Dashboard</span>
          </div>
          <Button variant="outline" className="bg-transparent" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Dashboard</CardTitle>
            <CardDescription>Overview of current production status</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Dashboard content will be implemented here...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}