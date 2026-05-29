import ApiStatus from '../components/ApiStatus'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Music for the moment
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
          MoodTunes pairs emotional context with the right soundtrack.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          A clean full-stack foundation for mood-aware playlists, user profiles,
          JWT authentication, and future AI recommendation services.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/signup"
            className="rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </div>
      <ApiStatus />
    </section>
  )
}

export default HomePage
