import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
import { getPlaylist, removeSongFromPlaylist } from '../services/musicService'

function PlaylistDetail() {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPlaylist(playlistId)
      .then(setPlaylist)
      .catch(() => setError('Unable to load playlist.'))
      .finally(() => setIsLoading(false))
  }, [playlistId])

  const handleRemoveSong = async (song) => {
    setError('')
    try {
      await removeSongFromPlaylist(playlistId, song.id)
      setPlaylist((current) => ({
        ...current,
        songs: current.songs.filter((item) => item.song.id !== song.id),
        song_count: Math.max((current.song_count || 1) - 1, 0),
      }))
    } catch {
      setError('Unable to remove song from playlist.')
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading playlist..." />
  }

  if (!playlist) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Playlist unavailable</h1>
        <Link
          to="/playlists"
          className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Back to playlists
        </Link>
      </section>
    )
  }

  return (
    <section>
      <Link to="/playlists" className="text-sm font-medium text-teal-700 dark:text-teal-300">
        Back to playlists
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{playlist.name}</h1>
      {playlist.description && (
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{playlist.description}</p>
      )}

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {playlist.songs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">No songs yet</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Add songs from recommendations, history, or favorites.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {playlist.songs.map((item) => (
            <SongCard
              key={item.id}
              song={item.song}
              secondaryAction={
                <button
                  type="button"
                  onClick={() => handleRemoveSong(item.song)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                  Remove
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default PlaylistDetail
