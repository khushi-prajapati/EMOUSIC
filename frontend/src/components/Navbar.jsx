import { useState } from 'react'
import {
  BarChart3,
  Brain,
  Heart,
  Home,
  LayoutDashboard,
  Library,
  ListMusic,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Music2,
  Shield,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTheme } from '../context/useTheme'
import Button from './ui/Button'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const djangoAdminUrl = import.meta.env.VITE_DJANGO_ADMIN_URL || apiBaseUrl.replace(/\/api\/?$/, '/admin/')

const navItems = [
  { to: '/', label: 'Home', icon: Home, public: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/moods', label: 'Moods', icon: Sparkles },
  { to: '/ai-detect', label: 'AI Detect', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/spotify', label: 'Spotify', icon: Music2 },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/history', label: 'History', icon: Library },
]

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const canOpenAdmin = Boolean(user?.is_staff || user?.is_superuser)

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.16)]'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/login')
  }

  const links = navItems.filter((item) => item.public || isAuthenticated)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="group inline-flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-fuchsia-500 to-emerald-300 text-slate-950 shadow-[0_0_36px_rgba(34,211,238,0.35)]">
            <Music2 size={22} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-white">MoodTunes</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200 sm:block">
              AI music engine
            </span>
          </span>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-xl border border-white/10 bg-white/[0.08] p-2 text-white lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {canOpenAdmin && (
            <a
              href={djangoAdminUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/20"
            >
              <Shield size={16} />
              Admin
            </a>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.08] text-slate-200 hover:bg-white/[0.12]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <>
              <span className="max-w-28 truncate text-sm font-semibold text-slate-300">
                {user?.username}
              </span>
              <Button type="button" onClick={handleLogout} variant="secondary">
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                <LogIn size={16} />
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-slate-950/90 p-3">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setIsOpen(false)}>
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-slate-200"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                Theme
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-slate-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <NavLink to="/login" className={navLinkClass} onClick={() => setIsOpen(false)}>
                  <LogIn size={16} />
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
