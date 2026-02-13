import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import NewBookmark from '@/components/NewBookmark'
import RealtimeBookmarks from '@/components/RealtimeBookmarks'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, fetch their bookmarks server-side for initial render
  const { data: bookmarks } = user
    ? await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              B
            </div>
            <h1 className="text-xl font-bold tracking-tight">SmartBookmarks</h1>
          </div>
          <AuthButton user={user} />
        </header>

        {/* Content */}
        {user ? (
          <>
            <NewBookmark user={user} />
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your List</h2>
              <RealtimeBookmarks serverBookmarks={bookmarks || []} />
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Sign in to manage your private bookmarks.</p>
          </div>
        )}
      </div>
    </main>
  )
}