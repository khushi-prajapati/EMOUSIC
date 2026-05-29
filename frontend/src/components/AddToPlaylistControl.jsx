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
        className="min-w-36 rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
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
        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {isAdding ? 'Adding...' : 'Add'}
      </button>
    </div>
  )
}

export default AddToPlaylistControl
