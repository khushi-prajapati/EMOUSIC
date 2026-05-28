function InputField({ error, label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-red-700 dark:text-red-300">{error}</span>}
    </label>
  )
}

export default InputField
