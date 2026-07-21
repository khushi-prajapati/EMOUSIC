function AudioVisualizer({ bars = 24, active = true }) {
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={`w-1 rounded-full bg-gradient-to-t from-cyan-300 via-fuchsia-400 to-emerald-300 ${
            active ? 'animate-equalizer' : ''
          }`}
          style={{
            height: `${18 + ((index * 13) % 28)}px`,
            animationDelay: `${index * 80}ms`,
          }}
        />
      ))}
    </div>
  )
}

export default AudioVisualizer
