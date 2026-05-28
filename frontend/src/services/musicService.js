import api from './api'

export async function getMoods() {
  const { data } = await api.get('/music/moods/')
  return data
}

export async function getRecommendations(mood) {
  const { data } = await api.post('/music/recommend/', { mood })
  return data
}

export async function getRecommendationHistory() {
  const { data } = await api.get('/music/history/')
  return data
}
