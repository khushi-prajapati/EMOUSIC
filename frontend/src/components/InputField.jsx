function InputField({ error, label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <input
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
        {...props}
      />
      {error && <span className="mt-2 block text-sm text-rose-300">{error}</span>}
    </label>
  )
}

export default InputField
