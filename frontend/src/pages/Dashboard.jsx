import { Link } from 'react-router-dom'
import { BarChart3, Brain, Heart, History, ListMusic, Sparkles } from 'lucide-react'
import AudioVisualizer from '../components/ui/AudioVisualizer'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import StatCard from '../components/ui/StatCard'
import Surface from '../components/ui/Surface'
import { useAuth } from '../context/useAuth'

const actions = [
  ['Choose a mood', '/moods', Sparkles],
  ['AI detect', '/ai-detect', Brain],
  ['Analytics', '/analytics', BarChart3],
  ['Playlists', '/playlists', ListMusic],
]

function Dashboard() {
  const { user } = useAuth()

  return (
    <PageShell
      eyebrow="Command center"
      title={`Welcome, ${user?.username || 'listener'}`}
      subtitle="Your AI music workspace is ready for mood selection, live emotion scanning, saved tracks, analytics, and playlist curation."
      action={<Button as={Link} to="/moods">Generate queue</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Sparkles} label="Mood engine" value="Live" />
        <StatCard icon={Brain} label="AI scanner" value="Ready" tone="from-fuchsia-300 to-violet-500" />
        <StatCard icon={Heart} label="Library sync" value="On" tone="from-rose-300 to-pink-500" />
        <StatCard icon={History} label="History" value="Tracked" tone="from-emerald-300 to-cyan-400" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Realtime signal</p>
              <h2 className="mt-3 text-3xl font-black text-white">Your listening state</h2>
              <p className="mt-3 max-w-xl text-slate-300">
                MoodTunes keeps the current recommendation context in sync with your mood selections, camera reads, and saved library.
              </p>
            </div>
            <AudioVisualizer bars={34} />
          </div>
        </Surface>

        <Surface className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200">Quick launch</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {actions.map(([label, to, Icon]) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.1]"
              >
                <Icon className="text-cyan-200 transition group-hover:scale-110" size={22} />
                <p className="mt-3 text-sm font-bold text-white">{label}</p>
              </Link>
            ))}
          </div>
        </Surface>
      </section>
    </PageShell>
  )
}

export default Dashboard
