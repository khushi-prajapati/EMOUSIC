import api from './api'

export async function detectEmotion(image) {
  const { data } = await api.post('/ai/detect-emotion/', { image })
  return data
}

export async function getPersonalizedRecommendations(payload) {
  const { data } = await api.post('/ai/personalized-recommendations/', payload)
  return data
}
