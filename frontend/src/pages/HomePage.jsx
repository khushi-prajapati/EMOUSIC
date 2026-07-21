import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Brain, Camera, Heart, Music2, Play, Sparkles, Waves } from 'lucide-react'
import ApiStatus from '../components/ApiStatus'
import AudioVisualizer from '../components/ui/AudioVisualizer'
import Button from '../components/ui/Button'
import Surface from '../components/ui/Surface'
import { fadeUp, staggerContainer } from '../animations/motion'

const features = [
  ['AI emotion scanner', 'Camera-powered mood mapping that adapts your queue in real time.', Brain],
  ['YouTube playback', 'Embedded music recommendations stay fast, familiar, and playable.', Play],
  ['Spotify enrichment', 'Search tracks, import public playlists, and inspect artist metadata.', Music2],
  ['Personal library', 'Favorites, playlists, and history keep every good recommendation close.', Heart],
]

const playlist = ['Neon Focus', 'Afterglow Drive', 'Rainy Window', 'Pulse Therapy']

function HomePage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-24">
      <section className="relative min-h-[calc(100vh-110px)] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 px-5 py-10 shadow-[0_30px_120px_rgba(0,0,0,0.42)] sm:px-8 lg:px-12">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          <div className="absolute bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-cyan-300/20" />
          <div className="absolute right-10 top-10 h-64 w-64 rounded-full border border-fuchsia-300/20" />
        </div>

        <div className="relative grid min-h-[70vh] gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div variants={fadeUp} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100">
              <Sparkles size={15} />
              Premium AI music intelligence
            </p>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
              MoodTunes
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A cinematic music platform that reads emotional context, creates mood-aware recommendations, and turns listening into a real-time AI experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/signup">
                Start listening
              </Button>
              <Button as={Link} to="/ai-detect" variant="secondary">
                Open AI scanner
              </Button>
            </div>
            <div className="mt-8 max-w-sm">
              <ApiStatus />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <Surface className="overflow-hidden p-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(34,211,238,0.35),transparent_28%),radial-gradient(circle_at_70%_70%,rgba(217,70,239,0.32),transparent_32%)]" />
                <div className="absolute inset-x-8 top-8 rounded-3xl border border-cyan-300/30 bg-slate-950/45 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
                    <span>Live AI scan</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                  </div>
                  <div className="mt-5 grid aspect-video place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                    <Camera className="text-cyan-200" size={54} />
                  </div>
                </div>
                <div className="absolute inset-x-8 bottom-8 rounded-3xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200">Mood lock</p>
                      <p className="mt-1 text-2xl font-black text-white">Focused energy</p>
                    </div>
                    <Waves className="text-emerald-200" />
                  </div>
                  <div className="mt-5">
                    <AudioVisualizer bars={30} />
                  </div>
                </div>
              </div>
            </Surface>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map(([title, text, Icon]) => (
          <Surface key={title} interactive className="p-5">
            <Icon className="text-cyan-200" size={26} />
            <h2 className="mt-5 text-lg font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
          </Surface>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">AI emotion demo</p>
          <h2 className="mt-3 text-3xl font-black text-white">Scan, map, recommend.</h2>
          <p className="mt-3 text-slate-300">
            Webcam emotion detection updates the music mood and refreshes recommendations only when the emotional signal changes.
          </p>
          <Button as={Link} to="/ai-detect" className="mt-6">
            Try live scan
          </Button>
        </Surface>
        <Surface className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200">Playlist showcase</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {playlist.map((name, index) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="mt-1 text-xs text-slate-400">{12 + index * 3} adaptive tracks</p>
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Surface className="p-6 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Analytics preview</p>
          <div className="mt-6 grid h-64 items-end gap-3 sm:grid-cols-8">
            {[42, 68, 36, 78, 54, 92, 64, 82].map((height, index) => (
              <div key={index} className="rounded-t-2xl bg-gradient-to-t from-cyan-400 to-fuchsia-500" style={{ height: `${height}%` }} />
            ))}
          </div>
        </Surface>
        <Surface className="p-6">
          <BarChart3 className="text-cyan-200" />
          <h2 className="mt-5 text-2xl font-black text-white">Insights that feel alive.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Mood trends, emotion statistics, recommendation frequency, and listening signals are ready for the premium dashboard.
          </p>
        </Surface>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {['Feels like the app understands the room.', 'The AI scanner is the hook.', 'Playlist flow is fast and polished.'].map((quote) => (
          <Surface key={quote} className="p-6">
            <p className="text-lg font-semibold leading-8 text-white">"{quote}"</p>
            <p className="mt-4 text-sm text-slate-400">Beta listener</p>
          </Surface>
        ))}
      </section>

      <footer className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center">
        <h2 className="text-3xl font-black text-white">Build your emotional music profile.</h2>
        <div className="mt-6 flex justify-center">
          <Button as={Link} to="/signup">Create account</Button>
        </div>
      </footer>
    </motion.div>
  )
}

export default HomePage
