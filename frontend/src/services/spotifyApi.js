import api from './api'

export async function searchSpotifyTracks(query) {
  const { data } = await api.get('/music/spotify/search/', {
    params: { q: query },
  })
  return data.results
}
