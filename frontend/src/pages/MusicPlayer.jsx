import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmbeddedPlayer from '../components/EmbeddedPlayer'
import SongCard from '../components/SongCard'

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
            />
          ))}
        </div>
      </aside>
    </section>
  )
}

export default MusicPlayer
