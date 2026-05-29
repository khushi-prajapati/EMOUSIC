import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmbeddedPlayer from '../components/EmbeddedPlayer'
import WebcamEmotionDetector from '../components/ai/WebcamEmotionDetector'
import SongCard from '../components/SongCard'
import { detectEmotion, getPersonalizedRecommendations } from '../services/aiApi'

function AIEmotionDetection() {
  const navigate = useNavigate()
  const lastRecommendedMoodRef = useRef('')
  const [isRecommending, setIsRecommending] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')
  const [detection, setDetection] = useState(null)
  const [songs, setSongs] = useState([])
  const [activeSong, setActiveSong] = useState(null)
  const [personalization, setPersonalization] = useState(null)

  const refreshRecommendations = useCallback(async (nextDetection) => {
    if (!nextDetection?.mapped_mood || lastRecommendedMoodRef.current === nextDetection.mapped_mood) {
      return
    }

    lastRecommendedMoodRef.current = nextDetection.mapped_mood
    setRecommendationError('')
    setIsRecommending(true)

    try {
      const recommendations = await getPersonalizedRecommendations({
        mood: nextDetection.mapped_mood,
        emotion: nextDetection.emotion,
        confidence: Number(nextDetection.confidence),
      })
      setSongs(recommendations.songs)
      setActiveSong(recommendations.songs[0] || null)
      setPersonalization(recommendations.personalization)
      sessionStorage.setItem('moodtunes_current_playlist', JSON.stringify(recommendations.songs))
      sessionStorage.setItem('moodtunes_current_mood', recommendations.mood)
      sessionStorage.setItem('moodtunes_last_emotion_detection', JSON.stringify(nextDetection))
    } catch (apiError) {
      lastRecommendedMoodRef.current = ''
      setRecommendationError(apiError.response?.data?.detail || 'Unable to refresh personalized recommendations.')
    } finally {
      setIsRecommending(false)
    }
  }, [])

  const handleDetected = useCallback(async (image) => {
    const detection = await detectEmotion(image)
    setDetection(detection)
    refreshRecommendations(detection)
    return detection
  }, [refreshRecommendations])

  const openPlayer = () => {
    if (!songs.length) {
      return
    }

    sessionStorage.setItem('moodtunes_current_playlist', JSON.stringify(songs))
    sessionStorage.setItem('moodtunes_current_mood', detection?.mapped_mood || 'AI mood')
    navigate('/player')
  }

  return (
    <section className="space-y-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          Real-time AI mode
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Live emotion detection with personalized music intelligence.
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          MoodTunes scans every few seconds, detects emotion changes, and refreshes recommendations only when the mapped music mood changes.
        </p>
      </div>

      <WebcamEmotionDetector onDetected={handleDetected} isRecommending={isRecommending} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <EmbeddedPlayer song={activeSong} />
          {detection && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Current AI reading
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Emotion</dt>
                  <dd className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">
                    {detection.emotion}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Mood</dt>
                  <dd className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">
                    {detection.mapped_mood}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Confidence</dt>
                  <dd className="mt-1 font-semibold text-slate-950 dark:text-white">
                    {Math.round(Number(detection.confidence) * 100)}%
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Personalized queue
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                Real-time recommendations
              </h2>
            </div>
            <button
              type="button"
              onClick={openPlayer}
              disabled={!songs.length}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Open player
            </button>
          </div>

          {personalization && (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Favorites</p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                  {personalization.favorite_count}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Playlist songs</p>
                <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                  {personalization.playlist_song_count}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Mood memory</p>
                <p className="mt-1 truncate font-semibold capitalize text-slate-950 dark:text-white">
                  {personalization.recent_moods?.join(', ') || 'New'}
                </p>
              </div>
            </div>
          )}

          {recommendationError && (
            <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {recommendationError}
            </p>
          )}

          <div className="mt-5 space-y-3">
            {songs.length ? (
              songs.map((song) => (
                <SongCard
                  key={song.id || song.videoId}
                  song={song}
                  isActive={activeSong?.videoId === song.videoId}
                  onPlay={setActiveSong}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Open the camera to begin live AI recommendations.
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default AIEmotionDetection
