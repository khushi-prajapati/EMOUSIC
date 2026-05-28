import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import { useAuth } from '../context/useAuth'
import AuthLayout from '../layouts/AuthLayout'

function Signup() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.username.trim()) nextErrors.username = 'Username is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.password) nextErrors.password = 'Password is required.'
    if (form.password && form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

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
      await signup(form)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const data = error.response?.data
      setApiError(data?.email?.[0] || data?.username?.[0] || data?.password?.[0] || 'Unable to create account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Start listening"
      title="Create your MoodTunes account."
      subtitle="Your profile will power saved moods, playlists, and recommendations."
    >
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Signup</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          error={errors.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          error={errors.password}
        />
        {apiError && <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link className="font-semibold text-teal-700 dark:text-teal-300" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Signup
