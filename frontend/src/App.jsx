import { Navigate, Route, Routes } from 'react-router-dom'
import AdminProtectedRoute from './admin/components/AdminProtectedRoute'
import AdminLayout from './admin/layouts/AdminLayout'
import AdminAnalytics from './admin/pages/AdminAnalytics'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminHistory from './admin/pages/AdminHistory'
import AdminLogin from './admin/pages/AdminLogin'
import AdminUsers from './admin/pages/AdminUsers'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import MoodSelection from './pages/MoodSelection'
import MusicPlayer from './pages/MusicPlayer'
import Signup from './pages/Signup'

function App() {
  return (
    <Routes>
      <Route path="admin-login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="admin-analytics" element={<AdminAnalytics />} />
          <Route path="admin-history" element={<AdminHistory />} />
        </Route>
      </Route>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="moods" element={<MoodSelection />} />
          <Route path="player" element={<MusicPlayer />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
