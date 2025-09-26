import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // Mock login - redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border rounded-md mt-1"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-md mt-1"
                placeholder="••••••••"
              />
            </div>
            <Button className="w-full" onClick={handleLogin}>
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}