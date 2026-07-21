import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MoodCard from '../components/MoodCard'
import LoadingSpinner from '../components/LoadingSpinner'
import PageShell from '../components/ui/PageShell'
import Surface from '../components/ui/Surface'
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
    <PageShell
      eyebrow="Mood engine"
      title="Pick a feeling. MoodTunes will find the music."
      subtitle="Each mood routes through the existing recommendation engine and creates a fresh playable YouTube queue."
      action={isRecommending ? <LoadingSpinner label="Finding songs..." /> : null}
    >

      {error && (
        <p className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {isLoading ? (
        <Surface className="p-6">
          <LoadingSpinner label="Loading moods..." />
        </Surface>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </PageShell>
  )
}

export default MoodSelection
