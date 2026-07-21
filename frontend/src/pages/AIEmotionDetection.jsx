import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmbeddedPlayer from '../components/EmbeddedPlayer'
import WebcamEmotionDetector from '../components/ai/WebcamEmotionDetector'
import SongCard from '../components/SongCard'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
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
    <PageShell
      eyebrow="Real-time AI mode"
      title="Live emotion detection with personalized music intelligence."
      subtitle="MoodTunes scans every few seconds, detects emotion changes, and refreshes recommendations only when the mapped music mood changes."
    >

      <WebcamEmotionDetector onDetected={handleDetected} isRecommending={isRecommending} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <EmbeddedPlayer song={activeSong} />
          {detection && (
            <Surface className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Current AI reading
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-slate-400">Emotion</dt>
                  <dd className="mt-1 font-bold capitalize text-white">
                    {detection.emotion}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Mood</dt>
                  <dd className="mt-1 font-bold capitalize text-white">
                    {detection.mapped_mood}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Confidence</dt>
                  <dd className="mt-1 font-bold text-white">
                    {Math.round(Number(detection.confidence) * 100)}%
                  </dd>
                </div>
              </dl>
            </Surface>
          )}
        </div>

        <Surface as="aside" className="p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                Personalized queue
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Real-time recommendations
              </h2>
            </div>
            <Button
              type="button"
              onClick={openPlayer}
              disabled={!songs.length}
            >
              Open player
            </Button>
          </div>

          {personalization && (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-slate-400">Favorites</p>
                <p className="mt-1 font-bold text-white">
                  {personalization.favorite_count}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-slate-400">Playlist songs</p>
                <p className="mt-1 font-bold text-white">
                  {personalization.playlist_song_count}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                <p className="text-slate-400">Mood memory</p>
                <p className="mt-1 truncate font-bold capitalize text-white">
                  {personalization.recent_moods?.join(', ') || 'New'}
                </p>
              </div>
            </div>
          )}

          {recommendationError && (
            <p className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
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
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">
                Open the camera to begin live AI recommendations.
              </div>
            )}
          </div>
        </Surface>
      </div>
    </PageShell>
  )
}

export default AIEmotionDetection
