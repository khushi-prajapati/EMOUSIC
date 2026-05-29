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
import LoadingSpinner from '../components/LoadingSpinner'
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
      <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </p>
    )
  }

  const summary = analytics?.summary || {}

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          Intelligence dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          MoodTunes analytics
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Users', summary.total_users],
          ['Active 30d', summary.active_users_30d],
          ['Recommendations', summary.recommendations],
          ['Emotion scans', summary.emotion_scans],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value || 0}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPanel title="Favorite moods">
          <BarChart data={analytics.favorite_moods || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartPanel>
        <ChartPanel title="Emotion trends">
          <BarChart data={analytics.emotion_trends || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartPanel>
        <ChartPanel title="Recommendation frequency">
          <LineChart data={analytics.recommendation_frequency || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#0f766e" strokeWidth={2} />
          </LineChart>
        </ChartPanel>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-950 dark:text-white">Top songs</h2>
          <div className="mt-4 space-y-3">
            {(analytics.top_songs || []).map((song) => (
              <div key={`${song.title}-${song.channel_title}`} className="flex justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-950 dark:text-white">{song.title}</p>
                  <p className="truncate text-slate-500 dark:text-slate-400">{song.channel_title}</p>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{song.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ChartPanel({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics
