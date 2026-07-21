import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
import { createPlaylist, deletePlaylist, getPlaylists } from '../services/musicService'

function Playlists() {
  const [playlists, setPlaylists] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    getPlaylists()
      .then(setPlaylists)
      .catch(() => setError('Unable to load playlists.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Playlist name is required.')
      return
    }

    setIsCreating(true)
    try {
      const playlist = await createPlaylist({
        name: form.name.trim(),
        description: form.description.trim(),
      })
      setPlaylists((current) => [playlist, ...current])
      setForm({ name: '', description: '' })
    } catch (apiError) {
      const detail = apiError.response?.data?.name || apiError.response?.data?.detail
      setError(Array.isArray(detail) ? detail.join(' ') : detail || 'Unable to create playlist.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (playlistId) => {
    setError('')
    try {
      await deletePlaylist(playlistId)
      setPlaylists((current) => current.filter((playlist) => playlist.id !== playlistId))
    } catch {
      setError('Unable to delete playlist.')
    }
  }

  return (
    <PageShell
      eyebrow="Your library"
      title="Playlists"
      subtitle="Create and curate custom collections from your AI-generated recommendations."
    >

      <Surface as="form" onSubmit={handleCreate} className="grid gap-3 p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Playlist name"
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
          />
          <Button
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Surface>

      {error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {isLoading ? (
        <Surface className="p-6">
          <LoadingSpinner label="Loading playlists..." />
        </Surface>
      ) : playlists.length === 0 ? (
        <EmptyState
          title="No playlists yet"
          message="Create your first playlist, then add songs from recommendations, favorites, or history."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {playlists.map((playlist) => (
            <Surface
              key={playlist.id}
              interactive
              className="p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{playlist.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {playlist.song_count || 0} songs
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(playlist.id)}
                  className="rounded-xl border border-rose-300/30 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </div>
              {playlist.description && (
                <p className="mt-3 text-sm text-slate-300">{playlist.description}</p>
              )}
              <Link
                to={`/playlists/${playlist.id}`}
                className="mt-4 inline-flex rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Open playlist
              </Link>
            </Surface>
          ))}
        </div>
      )}
    </PageShell>
  )
}

export default Playlists
