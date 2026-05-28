import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import api from '../services/api'

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem('moodtunes_access_token'),
  )

  const login = async (credentials) => {
    const { data } = await api.post('/auth/token/', credentials)

    localStorage.setItem('moodtunes_access_token', data.access)
    localStorage.setItem('moodtunes_refresh_token', data.refresh)
    setAccessToken(data.access)
  }

  const logout = () => {
    localStorage.removeItem('moodtunes_access_token')
    localStorage.removeItem('moodtunes_refresh_token')
    setAccessToken(null)
  }

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [accessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
