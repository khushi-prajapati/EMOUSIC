import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
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
      <EmptyState title="Playlist unavailable" message="This playlist could not be loaded." actionLabel="Back to playlists" actionTo="/playlists" />
    )
  }

  return (
    <PageShell
      eyebrow="Playlist"
      title={playlist.name}
      subtitle={playlist.description || 'A saved MoodTunes collection.'}
      action={<Button as={Link} to="/playlists" variant="secondary">Back to playlists</Button>}
    >

      {error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {playlist.songs.length === 0 ? (
        <EmptyState title="No songs yet" message="Add songs from recommendations, history, or favorites." />
      ) : (
        <div className="space-y-3">
          {playlist.songs.map((item) => (
            <SongCard
              key={item.id}
              song={item.song}
              secondaryAction={
                <button
                  type="button"
                  onClick={() => handleRemoveSong(item.song)}
                  className="rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                >
                  Remove
                </button>
              }
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}

export default PlaylistDetail
