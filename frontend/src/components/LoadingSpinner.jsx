import { motion } from 'framer-motion'

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-5 w-5 rounded-full border-2 border-white/20 border-t-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
      />
      <span>{label}</span>
    </div>
  )
}

export default LoadingSpinner
