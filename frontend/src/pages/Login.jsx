import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useAuth } from '../context/useAuth'
import AuthLayout from '../layouts/AuthLayout'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.username.trim()) nextErrors.username = 'Username or email is required.'
    if (!form.password) nextErrors.password = 'Password is required.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your MoodTunes account."
      subtitle="Keep your music profile, moods, and recommendations tied to your account."
    >
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          label="Username or email"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          error={errors.username}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          error={errors.password}
        />
        {apiError && <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        New to MoodTunes?{' '}
        <Link className="font-semibold text-teal-700 dark:text-teal-300" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
