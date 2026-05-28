import { useMemo, useState } from 'react'
import { AdminAuthContext } from './adminAuthContext'
import { adminLogin } from '../services/adminService'
import {
  clearAdminTokens,
  getAdminAccessToken,
  setAdminTokens,
} from '../services/adminTokenStorage'

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const rawUser = sessionStorage.getItem('moodtunes_admin_user')
    return rawUser ? JSON.parse(rawUser) : null
  })
  const [accessToken, setAccessToken] = useState(() => getAdminAccessToken())

  const login = async (credentials) => {
    const data = await adminLogin(credentials)

    setAdminTokens(data.tokens)
    sessionStorage.setItem('moodtunes_admin_user', JSON.stringify(data.user))
    setAccessToken(data.tokens.access)
    setAdminUser(data.user)
  }

  const logout = () => {
    clearAdminTokens()
    sessionStorage.removeItem('moodtunes_admin_user')
    setAccessToken(null)
    setAdminUser(null)
  }

  const value = useMemo(
    () => ({
      adminUser,
      isAdminAuthenticated: Boolean(accessToken && adminUser),
      login,
      logout,
    }),
    [accessToken, adminUser],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
