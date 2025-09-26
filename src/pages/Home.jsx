import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LayoutDashboard, Package, Printer, FileText, TrendingUp, Users, Settings, Box, LogIn, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const NAV_ITEMS = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Production', path: '/production', icon: Package },
  { title: 'Final marking', path: '/final-marking', icon: Printer },
  { title: 'Templates', path: '/templates', icon: FileText },
  { title: 'Reports', path: '/reports', icon: TrendingUp },
  { title: 'Models', path: '/models', icon: Box },
  { title: 'Users', path: '/users', icon: Users },
  { title: 'Settings', path: '/settings', icon: Settings },
]

const mockProductionData = {
  totalUnits: 1250,
  completed: 980,
  inProgress: 150,
  planned: 120,
  errors: 12
}

export default function Home() {
  const navigate = useNavigate()
  const efficiency = ((mockProductionData.completed / mockProductionData.totalUnits) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="no-print border-b bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Web Creator</span>
            <span className="text-gray-500">• Production Management System</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-transparent" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button variant="outline" className="bg-transparent" onClick={() => window.print()}>
              Print page
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-0">
        {/* Sidebar */}
        <aside className="no-print w-64 border-r bg-white min-h-[calc(100vh-56px)]">
          <div className="p-4 space-y-3 text-sm text-gray-700">
            <div className="font-medium text-gray-900">Navigation</div>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ title, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 transition"
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-800">{title}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-white min-h-[calc(100vh-56px)]">
          {/* Status Widgets */}
          <section className="no-print px-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Всего единиц</p>
                      <p className="text-2xl font-bold text-gray-900">{mockProductionData.totalUnits}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Завершено</p>
                      <p className="text-2xl font-bold text-green-600">{mockProductionData.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Эффективность: {efficiency}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">В работе</p>
                      <p className="text-2xl font-bold text-orange-600">{mockProductionData.inProgress}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ошибки</p>
                      <p className="text-2xl font-bold text-red-600">{mockProductionData.errors}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {NAV_ITEMS.map(({ title, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="group border rounded-lg p-4 text-left bg-white hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{title}</div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Printable Content */}
          <article className="print-area print-clean max-w-4xl mx-auto px-6 py-8 bg-white">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Print-friendly content</h1>
            <p className="text-gray-700 mb-4">
              This section is optimized for printing. Non-essential UI like navigation, sidebars, and backgrounds
              are removed. Text, images and tables remain readable.
            </p>

            <section className="section avoid-break mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Production table</h2>
              <div className="overflow-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Name</th>
                      <th className="border border-gray-300 p-2 text-left">SKU</th>
                      <th className="border border-gray-300 p-2 text-right">Qty</th>
                      <th className="border border-gray-300 p-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Label A</td>
                      <td className="border border-gray-300 p-2">SKU-001</td>
                      <td className="border border-gray-300 p-2 text-right">120</td>
                      <td className="border border-gray-300 p-2">For thermal print</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Label B</td>
                      <td className="border border-gray-300 p-2">SKU-002</td>
                      <td className="border border-gray-300 p-2 text-right">75</td>
                      <td className="border border-gray-300 p-2">Black text only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </article>
        </main>
      </div>

      {/* Footer */}
      <footer className="no-print border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500">
          © {new Date().getFullYear()} Web Creator
        </div>
      </footer>
    </div>
  )
}