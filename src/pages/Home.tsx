/**
 * Home page
 * Purpose: Provide visible entrances to all modules with live status widgets and keep a clean print-only article.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PrintOnly } from '../components/print/Visibility';
import {
  LayoutDashboard,
  Package,
  Printer,
  FileText,
  TrendingUp,
  Users,
  Settings,
  Box,
  LogIn,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

/** Small helper to concatenate classes */
function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Navigation item description */
interface NavItem {
  /** Display title */
  title: string;
  /** Route path */
  path: string;
  /** Icon component from lucide-react */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/** Shared list of app sections for sidebar + quick grid */
const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Production', path: '/production', icon: Package },
  { title: 'Final marking', path: '/final-marking', icon: Printer },
  { title: 'Templates', path: '/templates', icon: FileText },
  { title: 'Reports', path: '/reports', icon: TrendingUp },
  { title: 'Models', path: '/models', icon: Box },
  { title: 'Users', path: '/users', icon: Users },
  { title: 'Settings', path: '/settings', icon: Settings },
];

/** Mock data for status widgets */
const mockProductionData = {
  totalUnits: 1250,
  completed: 980,
  inProgress: 150,
  planned: 120,
  errors: 12
};

const mockRecentActivities = [
  { id: 1, type: 'production', message: 'Партия SKU-001 запущена', time: '2 мин назад', user: 'Менеджер' },
  { id: 2, type: 'printing', message: 'Финальная маркировка UUID-001-015', time: '5 мин назад', user: 'Оператор' },
  { id: 3, type: 'template', message: 'Шаблон "Премиум" обновлен', time: '10 мин назад', user: 'Администратор' },
];

/** Status Widgets Component */
function StatusWidgets() {
  const efficiency = ((mockProductionData.completed / mockProductionData.totalUnits) * 100).toFixed(1);
  
  return (
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
            <div className="mt-2 text-xs text-gray-500">
              За текущий период
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
            <div className="mt-2 text-xs text-gray-500">
              +{mockProductionData.planned} запланировано
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
            <div className="mt-2 text-xs text-gray-500">
              {(mockProductionData.errors / mockProductionData.totalUnits * 100).toFixed(1)}% от объема
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Последние действия</CardTitle>
          <CardDescription>Активность системы за последний час</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'production' ? 'bg-blue-500' :
                  activity.type === 'printing' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/** Header (hidden in print via 'no-print') */
function Header() {
  const navigate = useNavigate();
  return (
    <header className="app-nav no-print border-b bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">Web Creator</span>
          <span className="text-gray-500">• Production Management System</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={() => navigate('/login')}>
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
          <Button variant="outline" className="bg-white" onClick={() => window.print()}>
            Print page
          </Button>
        </div>
      </div>
    </header>
  );
}

/** Sidebar with real navigation (hidden in print) */
function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="app-sidebar no-print w-64 border-r bg-white min-h-[calc(100vh-56px)]">
      <div className="p-4 space-y-3 text-sm text-gray-700">
        <div className="font-medium text-gray-900">Navigation</div>
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ title, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full text-left flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 transition"
              aria-label={`Go to ${title}`}
            >
              <Icon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-800">{title}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
            </button>
          ))}
        </nav>
        <div className="text-xs text-gray-500 pt-2">
          Elements inside sidebar are not printed.
        </div>
      </div>
    </aside>
  );
}

/** Quick entrance tiles (screen only)
 * Renders module tiles with Russian descriptions and explicit "Перейти" button.
 * The whole tile is keyboard and mouse clickable for better UX and a11y.
 * Safe navigation avoids ghost-activation (Enter/Space carry-over).
 */
function QuickEntrances() {
  const navigate = useNavigate();

  /** Human-readable Russian descriptions per route */
  const descriptions: Record<string, string> = {
    '/dashboard': 'Общий обзор',
    '/production': 'Управление производством',
    '/final-marking': 'Финальная маркировка',
    '/templates': 'Настройка маркировки',
    '/reports': 'Отчеты и аналитика',
    '/models': 'Каталог продукции',
    '/users': 'Управление доступом',
    '/settings': 'Настройки системы',
  };

  /** Safe navigate: blur current focus and navigate after current event loop tick. */
  const safeNavigate = (path: string) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    // Увеличиваем задержку для Templates чтобы предотвратить carry-over событий
    const delay = path === '/templates' ? 200 : 0;
    setTimeout(() => navigate(path), delay);
  };

  /** Keyboard activation on Enter/Space using keyup to prevent carry-over */
  const onTileKeyUp = (e: React.KeyboardEvent<HTMLDivElement>, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      safeNavigate(path);
    }
  };

  return (
    <section className="no-print px-6 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {NAV_ITEMS.map(({ title, path, icon: Icon }) => (
          <div
            key={path}
            role="button"
            tabIndex={0}
            onClick={() => safeNavigate(path)}
            onKeyUp={(e) => onTileKeyUp(e, path)}
            className={cx(
              'group border rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-400'
            )}
            aria-label={`Перейти: ${title}`}
          >
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="text-sm text-gray-600">
                  {descriptions[path] || `Открыть ${title.toLowerCase()}`}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 mt-1" />
            </div>

            <div className="mt-4 flex items-center justify-end">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  safeNavigate(path);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Перейти
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Footer (hidden in print via 'no-print') */
function Footer() {
  return (
    <footer className="app-footer no-print border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} Web Creator — Footer is hidden on print
      </div>
    </footer>
  );
}

/** Main printable article kept clean for paper */
function Article() {
  // Simple table data to demonstrate printing
  const rows = [
    { name: 'Label A', sku: 'SKU-001', qty: 120, note: 'For thermal print' },
    { name: 'Label B', sku: 'SKU-002', qty: 75, note: 'Black text only' },
    { name: 'Label C', sku: 'SKU-003', qty: 40, note: 'Includes QR' },
  ];

  return (
    <article className="print-area print-clean max-w-4xl mx-auto px-6 py-8 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Print-friendly content</h1>
      <p className="text-gray-700 mb-4">
        This section is optimized for printing. Non-essential UI like navigation, sidebars, and backgrounds
        are removed. Text, images and tables remain readable.
      </p>

      <section className="section avoid-break mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <img src="https://pub-cdn.sider.ai/u/U07GHKZAW71/web-coder/68d5f831b54d8be52a865be0/resource/a95456fa-0c2a-49bd-843a-54b4d7bad0fe.jpg" alt="Производственный процесс - изображение 1" className="object-cover rounded border" />
          <img src="https://pub-cdn.sider.ai/u/U07GHKZAW71/web-coder/68d5f831b54d8be52a865be0/resource/eaaad02b-7c1d-44d0-9628-97e4a9974c12.jpg" alt="Производственный процесс - изображение 2" className="object-cover rounded border" />
        </div>
      </section>

      <section className="section mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Production table</h2>
        <div className="overflow-auto">
          <table>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">SKU</th>
                <th align="right">Qty</th>
                <th align="left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.sku}</td>
                  <td align="right">{r.qty}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section avoid-break">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Notes</h2>
        <p className="text-gray-700">
          Use class <code>no-print</code> to hide elements in print and <code>only-print</code> for elements visible
          only in print. Wrap your main article in <code>print-area print-clean</code>.
        </p>
      </section>

      {/* Example of print-only note */}
      <PrintOnly className="mt-6 text-xs">Printed on: {new Date().toLocaleString()}</PrintOnly>
    </article>
  );
}

/**
 * Home page component: combines screen layout and printable content.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-0">
        <Sidebar />
        <main className="bg-white min-h-[calc(100vh-56px)]">
          <StatusWidgets />
          <QuickEntrances />
          <Article />
        </main>
      </div>
      <Footer />
    </div>
  );
}