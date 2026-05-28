function MoodCard({ mood, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mood)}
      className={`rounded-lg border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? 'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <span className="text-3xl" aria-hidden="true">
        {mood.icon}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{mood.label}</h2>
      <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-400">
        Tune recommendations for {mood.value}
      </p>
    </button>
  )
}

export default MoodCard
