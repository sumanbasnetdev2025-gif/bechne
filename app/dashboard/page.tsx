'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { List, Eye, MessageCircle, PlusCircle } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ listings: 0, views: 0, conversations: 0, sold: 0 })
  const [recentBooks, setRecentBooks] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: books }, { data: convos }] = await Promise.all([
        supabase.from('books').select('id, title, asking_price, status, views, created_at').eq('seller_id', user!.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('conversations').select('id').or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`),
      ])
      const allBooks = books || []
      setRecentBooks(allBooks)
      setStats({
        listings: allBooks.filter((b) => b.status === 'available').length,
        views: allBooks.reduce((sum: number, b: any) => sum + (b.views || 0), 0),
        conversations: convos?.length || 0,
        sold: allBooks.filter((b) => b.status === 'sold').length,
      })
    }
    load()
  }, [user])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>
          Hello, {profile?.full_name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-stone-500 text-sm">Here's how your listings are doing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Active Listings" value={stats.listings} icon={<List size={18} />} color="amber" />
        <StatsCard label="Total Views" value={stats.views} icon={<Eye size={18} />} color="blue" />
        <StatsCard label="Conversations" value={stats.conversations} icon={<MessageCircle size={18} />} color="emerald" />
        <StatsCard label="Books Sold" value={stats.sold} icon={<List size={18} />} color="stone" />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <a href="/sell" className="flex items-center gap-2 bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-900 transition-colors text-sm">
          <PlusCircle size={16} /> List a Book
        </a>
        <a href="/messages" className="flex items-center gap-2 border-2 border-stone-200 text-stone-700 font-semibold px-5 py-2.5 rounded-xl hover:border-amber-400 hover:text-amber-800 transition-colors text-sm">
          <MessageCircle size={16} /> Messages
        </a>
      </div>

      {/* Recent listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-stone-900 text-lg" style={{ fontFamily: 'Lora, serif' }}>Recent Listings</h2>
          <a href="/dashboard/listings" className="text-amber-700 text-sm hover:underline">View all →</a>
        </div>
        {recentBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-stone-500 mb-4">You haven't listed any books yet.</p>
            <a href="/sell" className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-900 transition-colors text-sm">
              <PlusCircle size={15} /> List Your First Book
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between bg-white rounded-xl border border-stone-100 px-4 py-3">
                <div>
                  <div className="font-medium text-stone-800 text-sm">{book.title}</div>
                  <div className="text-stone-400 text-xs">Rs. {book.asking_price} · {book.views || 0} views</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${book.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                    {book.status === 'available' ? 'Available' : 'Sold'}
                  </span>
                  <a href={`/books/${book.id}`} className="text-amber-700 text-xs hover:underline">View</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}