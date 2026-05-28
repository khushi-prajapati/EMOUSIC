import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MoodCard from '../components/MoodCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoods, getRecommendations } from '../services/musicService'

function MoodSelection() {
  const navigate = useNavigate()
  const [moods, setMoods] = useState([])
  const [selectedMood, setSelectedMood] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRecommending, setIsRecommending] = useState(false)

  useEffect(() => {
    getMoods()
      .then(setMoods)
      .catch(() => setError('Unable to load moods.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSelect = async (mood) => {
    setSelectedMood(mood.value)
    setError('')
    setIsRecommending(true)

    try {
      const data = await getRecommendations(mood.value)
      sessionStorage.setItem('moodtunes_current_playlist', JSON.stringify(data.songs))
      sessionStorage.setItem('moodtunes_current_mood', mood.label)
      navigate('/player')
    } catch (apiError) {
      setError(apiError.response?.data?.detail || 'Unable to fetch recommendations.')
    } finally {
      setIsRecommending(false)
    }
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Choose your mood
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
            Pick a feeling. MoodTunes will find the music.
          </h1>
        </div>
        {isRecommending && <LoadingSpinner label="Finding songs..." />}
      </div>

      {error && (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="mt-8">
          <LoadingSpinner label="Loading moods..." />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moods.map((mood) => (
            <MoodCard
              key={mood.value}
              mood={mood}
              isSelected={selectedMood === mood.value}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default MoodSelection
