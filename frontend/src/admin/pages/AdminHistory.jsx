import { useEffect, useState } from 'react'
import { getAdminHistory } from '../services/adminService'

function AdminHistory() {
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAdminHistory()
      .then(setHistory)
      .catch(() => setError('Unable to load history.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Recommendation history</h1>
      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading history...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Mood</th>
                <th className="px-4 py-3">Recommendations</th>
                <th className="px-4 py-3">Searched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{item.username}</td>
                  <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">{item.mood}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.recommendation_count}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {new Date(item.searched_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default AdminHistory
