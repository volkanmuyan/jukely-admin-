import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useSocket }     from './hooks/useSocket'
import Sidebar           from './components/Sidebar'
import LoginPage         from './pages/LoginPage'
import DashboardPage     from './pages/DashboardPage'
import QueuePage         from './pages/QueuePage'
import TablesPage        from './pages/TablesPage'
import SettingsPage      from './pages/SettingsPage'

function ProtectedLayout() {
  const { isAuthed, token } = useAuth()
  const { queue, connected } = useSocket(token)

  if (!isAuthed) return <Navigate to="/login" replace />

  return (
    <div className="admin-layout">
      <Sidebar queueCount={queue.length} spotifyConnected={connected} />
      <div className="main-area">
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/queue"     element={<QueuePage />} />
            <Route path="/tables"    element={<TablesPage />} />
            <Route path="/settings"  element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
