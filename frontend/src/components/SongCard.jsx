import { Heart, ListPlus, Play, Radio } from 'lucide-react'
import { motion } from 'framer-motion'
import { springTransition } from '../animations/motion'

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
    <motion.article
      layout
      whileHover={{ y: -3 }}
      transition={springTransition}
      className={`grid gap-4 overflow-hidden rounded-2xl border bg-white/[0.07] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition sm:grid-cols-[132px_1fr_auto] sm:items-center ${
        isActive ? 'border-cyan-300/70 ring-1 ring-cyan-300/30' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={song.thumbnail}
          alt=""
          className="aspect-video w-full object-cover sm:w-[132px]"
          loading="lazy"
        />
        {isActive && (
          <span className="absolute inset-0 grid place-items-center bg-slate-950/45 text-cyan-200">
            <Radio size={24} />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="mb-2 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200">
          AI pick
        </p>
        <h3 className="line-clamp-2 font-semibold text-white">{song.title}</h3>
        <p className="mt-1 truncate text-sm text-slate-400">{song.channel}</p>
      </div>
      <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
        {onPlay && (
          <button
            type="button"
            onClick={() => onPlay(song)}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-100"
          >
            <Play size={15} />
            {isActive ? 'Playing' : 'Play'}
          </button>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(song)}
            disabled={isFavoriteLoading}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? 'border-rose-300/50 bg-rose-400/15 text-rose-100 hover:bg-rose-400/25'
                : 'border-white/10 text-slate-200 hover:bg-white/10'
            }`}
          >
            <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
        )}
        {playlistAction && (
          <div className="contents">
            <span className="sr-only"><ListPlus size={1} /></span>
            {playlistAction}
          </div>
        )}
        {secondaryAction}
      </div>
    </motion.article>
  )
}

export default SongCard
