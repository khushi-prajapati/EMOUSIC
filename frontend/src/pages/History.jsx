import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
import {
  addFavorite,
  addSongToPlaylist,
  getPlaylists,
  getRecommendationHistory,
  removeFavorite,
} from '../services/musicService'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingSongId, setPendingSongId] = useState(null)

  useEffect(() => {
    Promise.all([getRecommendationHistory(), getPlaylists()])
      .then(([historyData, playlistData]) => {
        setHistory(historyData)
        setPlaylists(playlistData)
        setFavoriteIds(
          new Set(historyData.flatMap((item) => item.recommendations.filter((song) => song.is_favorite).map((song) => song.id))),
        )
      })
      .catch(() => setError('Unable to load recommendation history.'))
      .finally(() => setIsLoading(false))
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

  return (
    <PageShell
      eyebrow="Recent activity"
      title="Recommendation history"
      subtitle="A timeline of mood searches and generated queues."
    >

      {isLoading && (
        <Surface className="p-6">
          <LoadingSpinner label="Loading history..." />
        </Surface>
      )}

      {error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {notice && (
        <p className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </p>
      )}

      {!isLoading && !error && history.length === 0 && (
        <EmptyState title="No history yet" message="Your mood searches and recommendations will appear here." />
      )}

      <div className="space-y-6">
        {history.map((item) => (
          <Surface key={item.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold capitalize text-white">
                {item.mood}
              </h2>
              <time className="text-sm text-slate-400">
                {new Date(item.searched_at).toLocaleString()}
              </time>
            </div>
            <div className="mt-4 space-y-3">
              {item.recommendations.map((song) => (
                <SongCard
                  key={`${item.id}-${song.id}`}
                  song={song}
                  isActive={false}
                  onPlay={() => {
                    sessionStorage.setItem('moodtunes_current_playlist', JSON.stringify(item.recommendations))
                    sessionStorage.setItem('moodtunes_current_mood', item.mood)
                    navigate('/player')
                  }}
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
        ))}
      </div>
    </PageShell>
  )
}

export default History
