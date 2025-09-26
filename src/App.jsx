import { HashRouter, Routes, Route, Navigate } from 'react-router'
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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/production" element={<Production />} />
        <Route path="/final-marking" element={<FinalMarking />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/models" element={<Models />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App