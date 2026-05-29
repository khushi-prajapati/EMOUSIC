import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { searchSpotifyTracks } from '../services/spotifyApi'

function Spotify() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    setError('')
    setIsLoading(true)

    try {
      setTracks(await searchSpotifyTracks(query.trim()))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to search Spotify.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          Spotify enrichment
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Search Spotify tracks
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tracks, artists, or albums"
          className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded-md bg-slate-950 px-5 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Search
        </button>
      </form>

      {isLoading && <LoadingSpinner label="Searching Spotify..." />}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {tracks.map((track) => (
          <article
            key={track.id}
            className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <img
              src={track.image_url}
              alt=""
              className="h-20 w-20 rounded-md bg-slate-100 object-cover dark:bg-slate-800"
            />
            <div className="min-w-0">
              <h2 className="truncate font-semibold text-slate-950 dark:text-white">{track.title}</h2>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {track.artists.join(', ')}
              </p>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{track.album}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {track.preview_url && (
                  <audio controls src={track.preview_url} className="h-9 max-w-full" />
                )}
                {track.spotify_url && (
                  <a
                    href={track.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Open Spotify
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Spotify
