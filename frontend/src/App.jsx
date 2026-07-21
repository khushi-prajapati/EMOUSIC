import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'

const AIEmotionDetection = lazy(() => import('./pages/AIEmotionDetection'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Favorites = lazy(() => import('./pages/Favorites'))
const History = lazy(() => import('./pages/History'))
const HomePage = lazy(() => import('./pages/HomePage'))
const Login = lazy(() => import('./pages/Login'))
const MoodSelection = lazy(() => import('./pages/MoodSelection'))
const MusicPlayer = lazy(() => import('./pages/MusicPlayer'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'))
const Playlists = lazy(() => import('./pages/Playlists'))
const Signup = lazy(() => import('./pages/Signup'))
const Spotify = lazy(() => import('./pages/Spotify'))

function App() {
  const location = useLocation()

  return (
    <Suspense fallback={<div className="p-6"><LoadingSpinner label="Loading experience..." /></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ai-detect" element={<AIEmotionDetection />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="moods" element={<MoodSelection />} />
              <Route path="player" element={<MusicPlayer />} />
              <Route path="history" element={<History />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlists/:playlistId" element={<PlaylistDetail />} />
              <Route path="spotify" element={<Spotify />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App
