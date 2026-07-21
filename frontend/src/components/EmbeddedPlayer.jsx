import { Music2 } from 'lucide-react'
import AudioVisualizer from './ui/AudioVisualizer'
import Surface from './ui/Surface'

function EmbeddedPlayer({ song }) {
  if (!song) {
    return (
      <Surface className="flex aspect-video items-center justify-center border-dashed text-center text-sm text-slate-400">
        <div>
          <Music2 className="mx-auto mb-3 text-cyan-200" size={30} />
          Select a song to start playing.
        </div>
      </Surface>
    )
  }

  return (
    <Surface className="overflow-hidden">
      <div className="relative">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1&rel=0`}
          title={song.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Now playing</p>
          <h2 className="mt-2 line-clamp-2 font-bold text-white">{song.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{song.channel}</p>
        </div>
        <AudioVisualizer bars={18} />
      </div>
    </Surface>
  )
}

export default EmbeddedPlayer
