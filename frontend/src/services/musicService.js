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

export async function getFavorites() {
  const { data } = await api.get('/music/favorites/')
  return data
}

export async function addFavorite(songId) {
  const { data } = await api.post('/music/favorites/', { song_id: songId })
  return data
}

export async function removeFavorite(songId) {
  await api.delete(`/music/favorites/${songId}/`)
}

export async function getPlaylists() {
  const { data } = await api.get('/music/playlists/')
  return data
}

export async function getPlaylist(playlistId) {
  const { data } = await api.get(`/music/playlists/${playlistId}/`)
  return data
}

export async function createPlaylist(payload) {
  const { data } = await api.post('/music/playlists/', payload)
  return data
}

export async function deletePlaylist(playlistId) {
  await api.delete(`/music/playlists/${playlistId}/`)
}

export async function addSongToPlaylist(playlistId, songId) {
  const { data } = await api.post(`/music/playlists/${playlistId}/songs/`, { song_id: songId })
  return data
}

export async function removeSongFromPlaylist(playlistId, songId) {
  await api.delete(`/music/playlists/${playlistId}/songs/${songId}/`)
}
