import { motion } from 'framer-motion'
import Surface from './Surface'

function StatCard({ icon: Icon, label, value, tone = 'from-cyan-300 to-fuchsia-400' }) {
  return (
    <Surface interactive className="relative overflow-hidden p-5">
      <div className={`absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${tone} opacity-25 blur-2xl`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value || 0}</p>
        </div>
        {Icon && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl border border-white/10 bg-white/10 p-3 text-cyan-200"
          >
            <Icon size={22} />
          </motion.div>
        )}
      </div>
    </Surface>
  )
}

export default StatCard
