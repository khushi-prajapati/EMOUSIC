import { useState } from 'react'
import { useAuth } from '../context/useAuth'

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login({ username, password })
    } catch {
      setError('Unable to sign in with those credentials.')
    }
  }

  return (
    <section className="max-w-md">
      <h1 className="text-3xl font-bold text-slate-950">Sign in</h1>
      <p className="mt-2 text-slate-600">
        Use the local superuser created during setup.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {isAuthenticated && (
          <p className="text-sm font-medium text-emerald-700">Signed in.</p>
        )}
        <button className="rounded-md bg-slate-950 px-4 py-2 font-medium text-white hover:bg-slate-800">
          Sign in
        </button>
      </form>
    </section>
  )
}

export default LoginPage
