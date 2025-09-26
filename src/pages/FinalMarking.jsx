import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'

export default function FinalMarking() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Final Marking</span>
          </div>
          <Button variant="outline" className="bg-transparent" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Final Marking System</h2>
          <p>Final marking interface will be implemented here...</p>
        </div>
      </main>
    </div>
  )
}