import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import api from '../services/api'
import { clearTokens, getAccessToken, setTokens } from '../services/tokenStorage'

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getAccessToken())
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(accessToken))

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login/', credentials)

    setTokens(data.tokens)
    setAccessToken(data.tokens.access)
    setUser(data.user)
  }

  const signup = async (payload) => {
    const { data } = await api.post('/auth/register/', payload)

    setTokens(data.tokens)
    setAccessToken(data.tokens.access)
    setUser(data.user)
  }

  const logout = () => {
    clearTokens()
    setAccessToken(null)
    setUser(null)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!accessToken) {
      return
    }

    api
      .get('/auth/profile/')
      .then((response) => setUser(response.data))
      .catch(() => logout())
      .finally(() => setIsLoading(false))
  }, [accessToken])

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isLoading,
      isAuthenticated: Boolean(accessToken),
      login,
      signup,
      logout,
    }),
    [accessToken, user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
