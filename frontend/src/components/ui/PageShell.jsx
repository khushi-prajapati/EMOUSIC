import { motion } from 'framer-motion'
import { fadeUp, pageVariants, staggerContainer } from '../../animations/motion'

function PageShell({ eyebrow, title, subtitle, action, children, className = '' }) {
  return (
    <motion.section
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`space-y-8 ${className}`}
    >
      {(eyebrow || title || subtitle || action) && (
        <motion.header
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div className="max-w-3xl">
            {eyebrow && (
              <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                {eyebrow}
              </motion.p>
            )}
            {title && (
              <motion.h1 variants={fadeUp} className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                {subtitle}
              </motion.p>
            )}
          </div>
          {action && <motion.div variants={fadeUp}>{action}</motion.div>}
        </motion.header>
      )}
      {children}
    </motion.section>
  )
}

export default PageShell
