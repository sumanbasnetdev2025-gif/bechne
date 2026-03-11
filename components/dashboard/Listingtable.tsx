'use client'
import { useState } from 'react'
import { Eye, Pencil, CheckCircle, Trash2, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatDate } from '@/lib/utils'
import { CONDITION_LABELS, CONDITION_COLORS } from '@/types/book'
import type { Book } from '@/types/book'
import toast from 'react-hot-toast'

interface ListingTableProps {
  books: Book[]
  onRefetch: () => void
}

export function ListingTable({ books, onRefetch }: ListingTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const markSold = async (id: string) => {
    setLoading(id)
    const { error } = await supabase
      .from('books')
      .update({ status: 'sold' })
      .eq('id', id)
    if (error) toast.error('Failed to update')
    else { toast.success('Marked as sold!'); onRefetch() }
    setLoading(null)
  }

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing permanently?')) return
    setLoading(id)
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) toast.error('Failed to delete')
    else { toast.success('Listing deleted'); onRefetch() }
    setLoading(null)
  }

  if (!books.length) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-stone-500 mb-4">You haven't listed any books yet.</p>
        <a href="/sell" className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-900 transition-colors text-sm">
          List Your First Book
        </a>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-100">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-100">
          <tr>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Book</th>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Condition</th>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Price</th>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Status</th>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Listed</th>
            <th className="text-left px-4 py-3 text-stone-500 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50 bg-white">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-stone-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={book.cover_image || book.images?.[0] || ''}
                    alt={book.title}
                    className="w-10 h-12 object-cover rounded-lg bg-stone-100 flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x48/F5F0E8/92400E?text=📚' }}
                  />
                  <div>
                    <div className="font-semibold text-stone-800 line-clamp-1">{book.title}</div>
                    <div className="text-stone-400 text-xs">{book.author}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CONDITION_COLORS[book.condition]}`}>
                  {CONDITION_LABELS[book.condition]}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-amber-800">
                {formatPrice(book.asking_price)}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  book.status === 'available' ? 'bg-emerald-100 text-emerald-700'
                  : book.status === 'sold' ? 'bg-stone-100 text-stone-500'
                  : 'bg-amber-100 text-amber-700'
                }`}>
                  {book.status === 'available' ? 'Available' : book.status === 'sold' ? 'Sold' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-stone-400 text-xs">
                {formatDate(book.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <a href={`/books/${book.id}`}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                    title="View">
                    <Eye size={15} />
                  </a>
                  <a href={`/sell?edit=${book.id}`}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-amber-700 transition-colors"
                    title="Edit">
                    <Pencil size={15} />
                  </a>
                  {book.status === 'available' && (
                    <button
                      onClick={() => markSold(book.id)}
                      disabled={loading === book.id}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-stone-400 hover:text-emerald-600 transition-colors"
                      title="Mark as Sold">
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteListing(book.id)}
                    disabled={loading === book.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                    title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}