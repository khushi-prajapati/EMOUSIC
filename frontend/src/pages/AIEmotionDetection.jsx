import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WebcamEmotionDetector from '../components/ai/WebcamEmotionDetector'
import { detectEmotion } from '../services/aiApi'
import { getRecommendations } from '../services/musicService'

function AIEmotionDetection() {
  const navigate = useNavigate()
  const [isRecommending, setIsRecommending] = useState(false)

  const handleDetected = async (image) => {
    const detection = await detectEmotion(image)
    setIsRecommending(true)

    try {
      const recommendations = await getRecommendations(detection.mapped_mood)
      sessionStorage.setItem('moodtunes_current_playlist', JSON.stringify(recommendations.songs))
      sessionStorage.setItem('moodtunes_current_mood', detection.mapped_mood)
      sessionStorage.setItem('moodtunes_last_emotion_detection', JSON.stringify(detection))
      navigate('/player')
    } finally {
      setIsRecommending(false)
    }

    return detection
  }

  return (
    <section>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          Face emotion detection
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Let MoodTunes read the room and queue the music.
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Open your camera, capture a frame, and the detected mood will automatically start a fresh recommendation session.
        </p>
      </div>

      <WebcamEmotionDetector onDetected={handleDetected} isRecommending={isRecommending} />
    </section>
  )
}

export default AIEmotionDetection
