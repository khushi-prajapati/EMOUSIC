function ActivityTable({ activity }) {
  if (!activity?.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-slate-500 dark:text-slate-400">
          <tr>
            <th className="py-2 pr-4">User</th>
            <th className="py-2 pr-4">Mood</th>
            <th className="py-2 pr-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {activity.map((item) => (
            <tr key={item.id}>
              <td className="py-3 pr-4 text-slate-950 dark:text-white">{item.username}</td>
              <td className="py-3 pr-4 capitalize text-slate-700 dark:text-slate-300">{item.mood}</td>
              <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">
                {new Date(item.searched_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivityTable
