import { useEffect, useState } from 'react'
import UserTable from '../components/UserTable'
import { deleteAdminUser, getAdminUsers, updateUserStatus } from '../services/adminService'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = () => {
    setIsLoading(true)
    getAdminUsers()
      .then(setUsers)
      .catch(() => setError('Unable to load users.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleToggleStatus = async (user) => {
    setError('')
    try {
      const data = await updateUserStatus(user.id, !user.is_active)
      setUsers((current) => current.map((item) => (item.id === user.id ? data.user : item)))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to update user.')
    }
  }

  const handleDelete = async (user) => {
    setError('')
    try {
      await deleteAdminUser(user.id)
      setUsers((current) => current.filter((item) => item.id !== user.id))
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to delete user.')
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Block, unblock, or remove user accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>
      {error && <p className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading users...</p>
        ) : (
          <UserTable users={users} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
        )}
      </div>
    </section>
  )
}

export default AdminUsers
