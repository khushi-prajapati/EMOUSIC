import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/useAdminAuth'

function AdminProtectedRoute() {
  const { isAdminAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default AdminProtectedRoute
