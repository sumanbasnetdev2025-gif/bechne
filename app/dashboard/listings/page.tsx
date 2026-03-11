export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import type { Book } from '@/types/book'
import { ListingTable } from '@/components/dashboard/Listingtable'

export default function ListingsPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'available' | 'sold' | 'all'>('all')
  const supabase = createClient()

  const fetchListings = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    setBooks((data as Book[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchListings() }, [user])

  const filtered = tab === 'all' ? books
    : books.filter((b) => b.status === tab)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>My Listings</h1>
          <p className="text-stone-500 text-sm">{books.length} total books listed</p>
        </div>
        <a href="/sell" className="flex items-center gap-2 bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-900 transition-colors text-sm">
          <PlusCircle size={16} /> Add New
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {(['all', 'available', 'sold'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            {t} {t === 'all' ? `(${books.length})` : `(${books.filter((b) => b.status === t).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ListingTable books={filtered} onRefetch={fetchListings} />
      )}
    </div>
  )
}