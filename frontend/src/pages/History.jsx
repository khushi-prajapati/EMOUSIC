import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import SongCard from '../components/SongCard'
import { getRecommendationHistory } from '../services/musicService'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRecommendationHistory()
      .then(setHistory)
      .catch(() => setError('Unable to load recommendation history.'))
      .finally(() => setIsLoading(false))
  }, [])

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
