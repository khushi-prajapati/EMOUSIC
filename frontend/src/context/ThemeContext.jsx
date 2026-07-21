import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeContext'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('moodtunes_theme') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('moodtunes_theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
