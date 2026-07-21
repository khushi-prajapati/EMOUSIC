import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Brain, Music2, Users } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import PageShell from '../components/ui/PageShell'
import StatCard from '../components/ui/StatCard'
import Surface from '../components/ui/Surface'
import { getAnalyticsDashboard } from '../services/analyticsApi'

function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAnalyticsDashboard()
      .then(setAnalytics)
      .catch(() => setError('Unable to load analytics.'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingSpinner label="Loading analytics..." />
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    )
  }

  const summary = analytics?.summary || {}

  return (
    <PageShell
      eyebrow="Intelligence dashboard"
      title="MoodTunes analytics"
      subtitle="A futuristic control surface for mood trends, emotion statistics, recommendation frequency, and library signals."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Users" value={summary.total_users} />
        <StatCard icon={Activity} label="Active 30d" value={summary.active_users_30d} tone="from-emerald-300 to-cyan-400" />
        <StatCard icon={Music2} label="Recommendations" value={summary.recommendations} tone="from-fuchsia-300 to-pink-500" />
        <StatCard icon={Brain} label="Emotion scans" value={summary.emotion_scans} tone="from-violet-300 to-cyan-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Favorite moods">
          <BarChart data={analytics.favorite_moods || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="total" fill="#22d3ee" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartPanel>
        <ChartPanel title="Emotion trends">
          <BarChart data={analytics.emotion_trends || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="total" fill="#d946ef" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartPanel>
        <ChartPanel title="Recommendation frequency">
          <LineChart data={analytics.recommendation_frequency || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="total" stroke="#34d399" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartPanel>
        <Surface className="p-5">
          <h2 className="font-bold text-white">Top songs</h2>
          <div className="mt-4 space-y-3">
            {(analytics.top_songs || []).map((song, index) => (
              <div key={`${song.title}-${song.channel_title}`} className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{index + 1}. {song.title}</p>
                  <p className="truncate text-slate-400">{song.channel_title}</p>
                </div>
                <span className="font-black text-cyan-200">{song.total}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </PageShell>
  )
}

const tooltipStyle = {
  background: 'rgba(2, 6, 23, 0.92)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '14px',
  color: '#e2e8f0',
}

function ChartPanel({ title, children }) {
  return (
    <Surface className="p-5">
      <h2 className="font-bold text-white">{title}</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Surface>
  )
}

export default Analytics
