function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {['Mood history', 'Saved tracks', 'Recommendations'].map((label) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">{label}</h2>
            <p className="mt-2 text-sm text-slate-600">Ready for feature work.</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
