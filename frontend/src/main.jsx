import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AdminAuthProvider } from './admin/context/AdminAuthProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AdminAuthProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
