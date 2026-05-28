import ApiStatus from '../components/ApiStatus'

function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Music for the moment
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-slate-950 sm:text-5xl">
          MoodTunes pairs emotional context with the right soundtrack.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          A clean full-stack foundation for mood-aware playlists, user profiles,
          JWT authentication, and future AI recommendation services.
        </p>
      </div>
      <ApiStatus />
    </section>
  )
}

export default HomePage
