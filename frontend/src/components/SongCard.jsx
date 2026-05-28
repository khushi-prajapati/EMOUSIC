function SongCard({ song, isActive, onPlay }) {
  return (
    <article
      className={`grid gap-4 rounded-lg border bg-white p-3 shadow-sm transition sm:grid-cols-[132px_1fr_auto] sm:items-center dark:bg-slate-900 ${
        isActive ? 'border-teal-500 dark:border-teal-400' : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <img
        src={song.thumbnail}
        alt=""
        className="aspect-video w-full rounded-md object-cover sm:w-[132px]"
        loading="lazy"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-semibold text-slate-950 dark:text-white">{song.title}</h3>
        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{song.channel}</p>
      </div>
      <button
        type="button"
        onClick={() => onPlay(song)}
        className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        {isActive ? 'Playing' : 'Play'}
      </button>
    </article>
  )
}

export default SongCard
