import api from './api'

export async function searchSpotifyTracks(query) {
  const { data } = await api.get('/music/spotify/search/', {
    params: { q: query },
  })
  return data.results
}

export async function getSpotifyPlaylist(playlist) {
  const { data } = await api.get('/music/spotify/playlist/', {
    params: { playlist },
  })
  return data
}

export async function getSpotifyArtist(artistId) {
  const { data } = await api.get(`/music/spotify/artists/${artistId}/`)
  return data
}
