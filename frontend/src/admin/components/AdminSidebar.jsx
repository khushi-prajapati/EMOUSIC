import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin-dashboard', label: 'Dashboard' },
  { to: '/admin-users', label: 'Users' },
  { to: '/admin-analytics', label: 'Analytics' },
  { to: '/admin-history', label: 'History' },
]

function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-white text-slate-950 dark:bg-slate-100'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <aside className="bg-slate-950 p-4 text-white lg:min-h-screen lg:w-64">
      <div className="text-lg font-semibold">MoodTunes Admin</div>
      <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
