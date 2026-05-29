import { useAuth } from '../context/useAuth'
import { Link } from 'react-router-dom'

function Dashboard() {
  const { user } = useAuth()

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
        Your space
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
        Welcome, {user?.username || 'listener'}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Your protected dashboard is connected to JWT authentication and ready for
        mood history, saved tracks, and recommendations.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/moods"
          className="rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Choose a mood
        </Link>
        <Link
          to="/history"
          className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          View history
        </Link>
        <Link
          to="/favorites"
          className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Favorites
        </Link>
        <Link
          to="/playlists"
          className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Playlists
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {['Mood history', 'Saved tracks', 'Recommendations'].map((label) => (
          <article
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 dark:text-white">{label}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Ready for feature work.
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
