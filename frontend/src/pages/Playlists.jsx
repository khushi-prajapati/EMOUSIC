import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
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
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Your library
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Playlists</h1>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Playlist name"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="mt-8">
          <LoadingSpinner label="Loading playlists..." />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {playlists.map((playlist) => (
            <article
              key={playlist.id}
              className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{playlist.name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {playlist.song_count || 0} songs
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(playlist.id)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              </div>
              {playlist.description && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{playlist.description}</p>
              )}
              <Link
                to={`/playlists/${playlist.id}`}
                className="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Open playlist
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Playlists
