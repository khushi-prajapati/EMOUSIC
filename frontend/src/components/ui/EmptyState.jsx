import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './Button'
import Surface from './Surface'

function EmptyState({ title, message, actionLabel, onAction, actionTo }) {
  return (
    <Surface className="p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
        <Sparkles size={24} />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{message}</p>
      {(actionLabel && (onAction || actionTo)) && (
        <Button
          as={actionTo ? Link : 'button'}
          to={actionTo}
          onClick={onAction}
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </Surface>
  )
}

export default EmptyState
