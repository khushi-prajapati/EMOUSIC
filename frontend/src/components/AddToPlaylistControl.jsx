import { ListPlus } from 'lucide-react'
import { useState } from 'react'

function AddToPlaylistControl({ playlists, song, onAdd }) {
  const [playlistId, setPlaylistId] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  if (!playlists?.length) {
    return null
  }

  const handleAdd = async () => {
    if (!playlistId) {
      return
    }

    setIsAdding(true)
    try {
      await onAdd(playlistId, song)
      setPlaylistId('')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={playlistId}
        onChange={(event) => setPlaylistId(event.target.value)}
        className="min-h-10 min-w-36 rounded-xl border border-white/10 bg-slate-950/80 px-2 py-2 text-sm text-slate-200 outline-none focus:border-cyan-300/60"
        aria-label="Select playlist"
      >
        <option value="">Playlist</option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!playlistId || isAdding}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ListPlus size={15} />
        {isAdding ? 'Adding...' : 'Add'}
      </button>
    </div>
  )
}

export default AddToPlaylistControl
