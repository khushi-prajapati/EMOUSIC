import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
