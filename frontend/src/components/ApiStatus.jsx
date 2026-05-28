import { useEffect, useState } from 'react'
import api from '../services/api'

function ApiStatus() {
  const [status, setStatus] = useState('Checking API...')

  useEffect(() => {
    api
      .get('/health/')
      .then((response) => setStatus(response.data.service || 'API online'))
      .catch(() => setStatus('API offline'))
  }, [])

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-950 dark:text-white">Backend status</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</p>
    </aside>
  )
}

export default ApiStatus
