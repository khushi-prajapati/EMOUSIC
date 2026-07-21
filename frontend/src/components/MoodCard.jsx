import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { moodAccents } from '../constants/design'

function MoodCard({ mood, isSelected, onSelect }) {
  const accent = moodAccents[mood.value] || 'from-cyan-300 to-fuchsia-400'

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden rounded-2xl border p-5 text-left shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition ${
        isSelected
          ? 'border-cyan-300/70 bg-cyan-300/15'
          : 'border-white/10 bg-white/[0.07] hover:border-white/20'
      }`}
    >
      <span className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-25 blur-2xl transition group-hover:opacity-40`} />
      <span className="relative text-4xl" aria-hidden="true">
        {mood.icon}
      </span>
      <h2 className="relative mt-4 text-lg font-bold text-white">{mood.label}</h2>
      <p className="relative mt-1 text-sm capitalize text-slate-400">
        Tune recommendations for {mood.value}
      </p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
        <Sparkles size={14} />
        Analyze
      </span>
    </motion.button>
  )
}

export default MoodCard
