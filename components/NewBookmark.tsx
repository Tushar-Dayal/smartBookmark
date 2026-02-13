'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function NewBookmark({ user }: { user: any }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Safety check: Ensure we have a user and data
    if (!user?.id) {
      alert("You must be logged in!")
      return
    }
    if (!url || !title) return

    setLoading(true)
    
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        title,
        url,
        user_id: user.id, // Ensure this matches your DB column name
      })

    setLoading(false)

    if (error) {
      console.error('Full Error Object:', error)
      alert(`Error: ${error.message}`)
    } else {
     
      setUrl('')
      setTitle('')
    }
  }

  return (
    <form onSubmit={addBookmark} className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-gray-900"
        required
      />
      <input
        type="url"
        placeholder="URL (https://...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-gray-900"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}