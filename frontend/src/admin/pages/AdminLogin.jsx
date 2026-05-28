import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import InputField from '../../components/InputField'
import { useAdminAuth } from '../context/useAdminAuth'

function AdminLogin() {
  const { isAdminAuthenticated, login } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const from = location.state?.from?.pathname || '/admin-dashboard'

  if (isAdminAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password) {
      setError('Username and password are required.')
      return
    }

    setIsSubmitting(true)

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Admin login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-5xl items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
            Custom Admin
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold">MoodTunes control center.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Manage users, monitor recommendations, and understand mood trends from a dedicated admin workspace.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Admin login</h2>
          <div className="mt-6 space-y-4">
            <InputField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-md bg-white px-4 py-2 font-medium text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default AdminLogin
