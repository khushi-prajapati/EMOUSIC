import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getSpotifyArtist, getSpotifyPlaylist, searchSpotifyTracks } from '../services/spotifyApi'

function Spotify() {
  const [query, setQuery] = useState('')
  const [playlistInput, setPlaylistInput] = useState('')
  const [tracks, setTracks] = useState([])
  const [playlist, setPlaylist] = useState(null)
  const [artist, setArtist] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    setError('')
    setArtist(null)
    setIsLoading(true)

    try {
      setTracks(await searchSpotifyTracks(query.trim()))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to search Spotify.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaylistSubmit = async (event) => {
    event.preventDefault()

    if (!playlistInput.trim()) {
      return
    }

    setError('')
    setPlaylist(null)
    setIsLoading(true)

    try {
      setPlaylist(await getSpotifyPlaylist(playlistInput.trim()))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to load Spotify playlist.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArtistClick = async (artistId) => {
    if (!artistId) {
      return
    }

    setError('')
    setArtist(null)
    setIsLoading(true)

    try {
      setArtist(await getSpotifyArtist(artistId))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to load artist metadata.')
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

      <form onSubmit={handlePlaylistSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={playlistInput}
          onChange={(event) => setPlaylistInput(event.target.value)}
          placeholder="Paste a public Spotify playlist URL"
          className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !playlistInput.trim()}
          className="rounded-md border border-slate-300 px-5 py-2 font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Import Playlist
        </button>
      </form>

      {isLoading && <LoadingSpinner label="Searching Spotify..." />}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {artist && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row">
            {artist.image_url && (
              <img src={artist.image_url} alt="" className="h-28 w-28 rounded-md object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{artist.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {artist.followers.toLocaleString()} followers, popularity {artist.popularity}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {artist.genres.length ? artist.genres.join(', ') : 'No genre metadata available'}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {artist.albums.map((album) => (
              <a
                key={album.id}
                href={album.spotify_url}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
              >
                {album.image_url && <img src={album.image_url} alt="" className="h-12 w-12 rounded object-cover" />}
                <span className="min-w-0">
                  <span className="block truncate font-medium text-slate-950 dark:text-white">{album.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">{album.release_date}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {playlist && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row">
            {playlist.image_url && (
              <img src={playlist.image_url} alt="" className="h-24 w-24 rounded-md object-cover" />
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{playlist.name}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {playlist.owner}, {playlist.track_total} tracks
              </p>
              {playlist.spotify_url && (
                <a
                  href={playlist.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Open Spotify
                </a>
              )}
            </div>
          </div>
          <TrackGrid tracks={playlist.tracks} onArtistClick={handleArtistClick} />
        </section>
      )}

      <TrackGrid tracks={tracks} onArtistClick={handleArtistClick} />
    </section>
  )
}

function TrackGrid({ tracks, onArtistClick }) {
  if (!tracks.length) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tracks.map((track) => (
        <article
          key={track.id}
          className="grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {track.image_url ? (
            <img
              src={track.image_url}
              alt=""
              className="h-20 w-20 rounded-md bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="h-20 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
          )}
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-950 dark:text-white">{track.title}</h2>
            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              {track.artists.map((artist) => (
                <button
                  key={`${track.id}-${artist.id || artist.name}`}
                  type="button"
                  onClick={() => onArtistClick(artist.id)}
                  className="max-w-full truncate text-left hover:text-teal-700 dark:hover:text-teal-300"
                >
                  {artist.name}
                </button>
              ))}
            </div>
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
  )
}

export default Spotify
