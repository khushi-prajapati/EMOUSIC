import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatsCard from '../components/StatsCard'
import { getAdminStats } from '../services/adminService'

function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError('Unable to load analytics.'))
  }, [])

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
  }

  if (!stats) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading analytics...</p>
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatsCard label="Users" value={stats.total_users} />
        <StatsCard label="Playlists" value={stats.total_playlists} />
        <StatsCard label="Recommendations" value={stats.total_recommendations} />
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Top moods</h2>
        <div className="mt-6 h-80">
          {stats.top_moods.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_moods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No mood data yet.</p>
          )}
        </div>
      </section>
    </section>
  )
}

export default AdminAnalytics
