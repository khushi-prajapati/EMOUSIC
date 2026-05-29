import api from './api'

export async function detectEmotion(image) {
  const { data } = await api.post('/ai/detect-emotion/', { image })
  return data
}
