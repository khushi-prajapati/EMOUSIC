import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import EmbeddedPlayer from '../components/EmbeddedPlayer'
import SongCard from '../components/SongCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
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
      <EmptyState
        title="No playlist yet"
        message="Select a mood to generate a fresh playlist."
        actionLabel="Choose mood"
        actionTo="/moods"
      />
    )
  }

  return (
    <PageShell
      eyebrow={mood || 'Current playlist'}
      title="Now playing"
      subtitle="A premium playback room for your active recommendation queue."
      action={<Button as={Link} to="/moods" variant="secondary">New mood</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          {notice && (
            <p className="mb-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              {notice}
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
          <EmbeddedPlayer song={activeSong} />
        </div>
        <Surface as="aside" className="p-5">
          <h2 className="text-lg font-black text-white">Playlist</h2>
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
        </Surface>
      </div>
    </PageShell>
  )
}

export default MusicPlayer
