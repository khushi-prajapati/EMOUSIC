import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddToPlaylistControl from '../components/AddToPlaylistControl'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
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
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Recent activity
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
        Recommendation history
      </h1>

      {isLoading && (
        <div className="mt-8">
          <LoadingSpinner label="Loading history..." />
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {notice && (
        <p className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {notice}
        </p>
      )}

      {!isLoading && !error && history.length === 0 && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">No history yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Your mood searches and recommendations will appear here.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {history.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold capitalize text-slate-950 dark:text-white">
                {item.mood}
              </h2>
              <time className="text-sm text-slate-500 dark:text-slate-400">
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
          </article>
        ))}
      </div>
    </section>
  )
}

export default History
