import { useEffect, useState } from 'react'
import { Server } from 'lucide-react'
import api from '../services/api'
import Surface from './ui/Surface'

function ApiStatus() {
  const [status, setStatus] = useState('Checking API...')

  useEffect(() => {
    api
      .get('/health/')
      .then((response) => setStatus(response.data.service || 'API online'))
      .catch(() => setStatus('API offline'))
  }, [])

  return (
    <Surface as="aside" className="p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
          <Server size={18} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-white">Backend status</h2>
          <p className="mt-1 text-sm text-slate-300">{status}</p>
        </div>
      </div>
    </Surface>
  )
}

export default ApiStatus
