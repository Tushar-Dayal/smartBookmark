'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function RealtimeBookmarks({ serverBookmarks }: { serverBookmarks: any[] }) {
  const [bookmarks, setBookmarks] = useState<any[]>(serverBookmarks || [])
  const supabase = createClient()

  // update list
  useEffect(() => {
    setBookmarks(serverBookmarks || [])
  }, [serverBookmarks])

  useEffect(() => {
    const setupRealtime = async () => {
      // current session 
      await supabase.auth.getSession()

      const channel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'bookmarks' 
          },
          (payload) => {
            console.log('Realtime Change:', payload)
            if (payload.eventType === 'INSERT') {
              setBookmarks((prev) => [payload.new, ...prev])
            } else if (payload.eventType === 'DELETE') {
              setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime Status:', status)
        })

      return channel
    }

    const channelPromise = setupRealtime()

    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel)
      })
    }
  }, [supabase])

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Your Bookmarks</h2>
      <ul className="space-y-3">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="flex justify-between p-4 bg-white border rounded-xl shadow-sm border-gray-100">
            <div className="min-w-0">
              <p className="font-semibold truncate text-gray-900">{bookmark.title}</p>
              <a href={bookmark.url} target="_blank" className="text-sm text-blue-600 truncate block">
                {bookmark.url}
              </a>
            </div>
            <button onClick={() => deleteBookmark(bookmark.id)} className="text-red-400 hover:text-red-600 ml-4 font-medium">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}