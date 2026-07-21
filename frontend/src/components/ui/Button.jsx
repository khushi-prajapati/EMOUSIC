import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { springTransition } from '../../animations/motion'

const variants = {
  primary:
    'border-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] hover:shadow-[0_0_38px_rgba(217,70,239,0.32)]',
  secondary:
    'border-white/15 bg-white/[0.08] text-white hover:border-cyan-300/50 hover:bg-white/[0.12]',
  ghost:
    'border-transparent bg-transparent text-slate-300 hover:bg-white/[0.08] hover:text-white',
  danger:
    'border-rose-400/40 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20',
}

const Button = forwardRef(function Button(
  { as: Component = 'button', children, className = '', variant = 'primary', ...props },
  ref,
) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`

  if (Component !== 'button') {
    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    )
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
      className={classes}
      {...props}
    >
      {children}
    </motion.button>
  )
})

export default Button
