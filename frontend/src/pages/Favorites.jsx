import { useEffect, useMemo, useState } from 'react'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
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
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Saved songs
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Favorites</h1>

      {isLoading && (
        <div className="mt-8">
          <LoadingSpinner label="Loading favorites..." />
        </div>
      )}

      {notice && (
        <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {notice}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {!isLoading && !error && favorites.length === 0 && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">No favorites yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Favorite songs from your recommendations to keep them here.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-3">
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
    </section>
  )
}

export default Favorites
