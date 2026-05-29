import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import AIEmotionDetection from './pages/AIEmotionDetection'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import Favorites from './pages/Favorites'
import History from './pages/History'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import MoodSelection from './pages/MoodSelection'
import MusicPlayer from './pages/MusicPlayer'
import PlaylistDetail from './pages/PlaylistDetail'
import Playlists from './pages/Playlists'
import Signup from './pages/Signup'
import Spotify from './pages/Spotify'

function App() {
  return (
    <Routes>
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
  )
}

export default App
