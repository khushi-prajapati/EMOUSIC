import api from './api'

export async function getAnalyticsDashboard() {
  const { data } = await api.get('/analytics/dashboard/')
  return data
}
