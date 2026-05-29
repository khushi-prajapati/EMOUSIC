import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import EmbeddedPlayer from '../components/EmbeddedPlayer'
import SongCard from '../components/SongCard'
import {
  addFavorite,
  addSongToPlaylist,
  getFavorites,
  getPlaylists,
  removeFavorite,
} from '../services/musicService'

function MusicPlayer() {
  const songs = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('moodtunes_current_playlist') || '[]')
    } catch {
      return []
    }
  }, [])
  const mood = sessionStorage.getItem('moodtunes_current_mood')
  const [activeSong, setActiveSong] = useState(songs[0] || null)
  const [favoriteIds, setFavoriteIds] = useState(() => new Set(songs.filter((song) => song.is_favorite).map((song) => song.id)))
  const [playlists, setPlaylists] = useState([])
  const [pendingSongId, setPendingSongId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    Promise.all([getFavorites(), getPlaylists()])
      .then(([favorites, playlistData]) => {
        setFavoriteIds(new Set(favorites.map((favorite) => favorite.song.id)))
        setPlaylists(playlistData)
      })
      .catch(() => setError('Unable to load saved library state.'))
  }, [])

  const handleToggleFavorite = async (song) => {
    setError('')
    setNotice('')
    setPendingSongId(song.id)

    try {
      if (favoriteIds.has(song.id)) {
        await removeFavorite(song.id)
        setFavoriteIds((current) => {
          const next = new Set(current)
          next.delete(song.id)
          return next
        })
      } else {
        await addFavorite(song.id)
        setFavoriteIds((current) => new Set(current).add(song.id))
      }
    } catch (apiError) {
      const detail = apiError.response?.data?.song_id || apiError.response?.data?.detail
      setError(Array.isArray(detail) ? detail.join(' ') : detail || 'Unable to update favorite.')
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

  if (songs.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">No playlist yet</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Select a mood to generate a fresh playlist.
        </p>
        <Link
          to="/moods"
          className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Choose mood
        </Link>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          {mood || 'Current playlist'}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Now playing</h1>
        {notice && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {notice}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}
        <div className="mt-6">
          <EmbeddedPlayer song={activeSong} />
        </div>
      </div>
      <aside>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Playlist</h2>
        <div className="mt-4 space-y-3">
          {songs.map((song) => (
            <SongCard
              key={song.id || song.videoId}
              song={song}
              isActive={activeSong?.videoId === song.videoId}
              onPlay={setActiveSong}
              isFavorite={favoriteIds.has(song.id)}
              isFavoriteLoading={pendingSongId === song.id}
              onToggleFavorite={handleToggleFavorite}
              playlistAction={
                <AddToPlaylistControl playlists={playlists} song={song} onAdd={handleAddToPlaylist} />
              }
            />
          ))}
        </div>
      </aside>
    </section>
  )
}

export default MusicPlayer
