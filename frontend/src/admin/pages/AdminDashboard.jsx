import { useEffect, useState } from 'react'
import ActivityTable from '../components/ActivityTable'
import StatsCard from '../components/StatsCard'
import { getAdminStats } from '../services/adminService'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError('Unable to load admin stats.'))
  }, [])

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
  }

  if (!stats) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</p>
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total users" value={stats.total_users} />
        <StatsCard label="Total playlists" value={stats.total_playlists} />
        <StatsCard label="Recommendations" value={stats.total_recommendations} />
        <StatsCard label="Top mood" value={stats.most_selected_mood || 'None'} />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Recent activity</h2>
        <div className="mt-4">
          <ActivityTable activity={stats.recent_activity} />
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
