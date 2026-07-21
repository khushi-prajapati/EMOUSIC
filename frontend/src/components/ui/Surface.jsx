import { motion } from 'framer-motion'
import { fadeUp, springTransition } from '../../animations/motion'

function Surface({ as: Component = 'div', children, className = '', interactive = false, ...props }) {
  const classes = `rounded-2xl border border-white/10 bg-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`
  const motionProps = {
    variants: fadeUp,
    whileHover: interactive ? { y: -4, borderColor: 'rgba(103,232,249,0.5)' } : undefined,
    transition: springTransition,
    className: classes,
    ...props,
  }

  if (Component === 'form') {
    return <motion.form {...motionProps}>{children}</motion.form>
  }

  if (Component === 'aside') {
    return <motion.aside {...motionProps}>{children}</motion.aside>
  }

  if (Component === 'article') {
    return <motion.article {...motionProps}>{children}</motion.article>
  }

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  )
}

export default Surface
