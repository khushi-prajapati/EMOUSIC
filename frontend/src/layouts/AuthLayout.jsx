import { motion } from 'framer-motion'
import AudioVisualizer from '../components/ui/AudioVisualizer'
import Surface from '../components/ui/Surface'

function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-140px)] max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block"
      >
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-white">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          {subtitle}
        </p>
        <div className="mt-8">
          <AudioVisualizer bars={32} />
        </div>
      </motion.div>
      <Surface className="p-6 sm:p-8">
        {children}
      </Surface>
    </section>
  )
}

export default AuthLayout
