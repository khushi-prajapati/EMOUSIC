function EmbeddedPlayer({ song }) {
  if (!song) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Select a song to start playing.
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1&rel=0`}
        title={song.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <div className="p-4">
        <h2 className="font-semibold text-slate-950 dark:text-white">{song.title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{song.channel}</p>
      </div>
    </section>
  )
}

export default EmbeddedPlayer
