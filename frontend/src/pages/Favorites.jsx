import { useEffect, useMemo, useState } from 'react'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
import {
  addSongToPlaylist,
  getFavorites,
  getPlaylists,
  removeFavorite,
} from '../services/musicService'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingSongId, setPendingSongId] = useState(null)

  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.song.id)),
    [favorites],
  )

  useEffect(() => {
    Promise.all([getFavorites(), getPlaylists()])
      .then(([favoriteData, playlistData]) => {
        setFavorites(favoriteData)
        setPlaylists(playlistData)
      })
      .catch(() => setError('Unable to load favorites.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleRemoveFavorite = async (song) => {
    setError('')
    setNotice('')
    setPendingSongId(song.id)

    try {
      await removeFavorite(song.id)
      setFavorites((current) => current.filter((favorite) => favorite.song.id !== song.id))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to update favorite.')
    } finally {
      setPendingSongId(null)
    }
  }

  const handleAddToPlaylist = async (playlistId, song) => {
    setError('')
    setNotice('')

    try {
      await addSongToPlaylist(playlistId, song.id)
      setNotice('Song added to playlist.')
    } catch (apiError) {
      const detail = apiError.response?.data?.song_id || apiError.response?.data?.detail
      setError(Array.isArray(detail) ? detail.join(' ') : detail || 'Unable to add song to playlist.')
    }
  }

  return (
    <PageShell
      eyebrow="Saved songs"
      title="Favorites"
      subtitle="Your high-signal library of tracks worth returning to."
    >

      {isLoading && (
        <Surface className="p-6">
          <LoadingSpinner label="Loading favorites..." />
        </Surface>
      )}

      {notice && (
        <p className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </p>
      )}

      {error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {!isLoading && !error && favorites.length === 0 && (
        <EmptyState title="No favorites yet" message="Favorite songs from your recommendations to keep them here." />
      )}

      <div className="space-y-3">
        {favorites.map((favorite) => (
          <SongCard
            key={favorite.id}
            song={favorite.song}
            isFavorite={favoriteIds.has(favorite.song.id)}
            isFavoriteLoading={pendingSongId === favorite.song.id}
            onToggleFavorite={handleRemoveFavorite}
            playlistAction={
              <AddToPlaylistControl
                playlists={playlists}
                song={favorite.song}
                onAdd={handleAddToPlaylist}
              />
            }
          />
        ))}
      </div>
    </PageShell>
  )
}

export default Favorites
