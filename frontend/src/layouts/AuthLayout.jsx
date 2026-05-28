function AuthLayout({ children, eyebrow, title, subtitle }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-140px)] max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden lg:block">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {children}
      </div>
    </section>
  )
}

export default AuthLayout
