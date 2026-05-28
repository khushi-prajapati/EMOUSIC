import axios from 'axios'
import {
  clearAdminTokens,
  getAdminAccessToken,
  getAdminRefreshToken,
  setAdminTokens,
} from './adminTokenStorage'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
})

adminApi.interceptors.request.use((config) => {
  const token = getAdminAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refresh = getAdminRefreshToken()

    if (!refresh) {
      clearAdminTokens()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await axios.post(`${adminApi.defaults.baseURL}/auth/token/refresh/`, {
        refresh,
      })

      setAdminTokens({ access: data.access, refresh })
      originalRequest.headers.Authorization = `Bearer ${data.access}`
      return adminApi(originalRequest)
    } catch (refreshError) {
      clearAdminTokens()
      return Promise.reject(refreshError)
    }
  },
)

export default adminApi
