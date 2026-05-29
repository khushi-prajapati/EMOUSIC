function SongCard({
  song,
  isActive,
  onPlay,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  playlistAction,
  secondaryAction,
}) {
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
      <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
        {onPlay && (
          <button
            type="button"
            onClick={() => onPlay(song)}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isActive ? 'Playing' : 'Play'}
          </button>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(song)}
            disabled={isFavoriteLoading}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? 'border-rose-500 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
        )}
        {playlistAction}
        {secondaryAction}
      </div>
    </article>
  )
}

export default SongCard
