'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { BookGrid } from '@/components/books/BookGrid'
import { BookFilters } from '@/components/books/BookFilters'
import { useBooks } from '@/lib/hooks/useBooks'

export default function BooksPage() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<{
    condition?: string
    minPrice?: number
    maxPrice?: number
    deliveryType?: string
    city?: string
  }>({})

  const { books, loading } = useBooks({
    search: query,
    condition: filters.condition,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    city: filters.city,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Browse Books</h1>
        <p className="text-stone-500">Find your next read at a fraction of the price</p>
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white border-2 border-stone-200 rounded-xl overflow-hidden hover:border-amber-400 focus-within:border-amber-400 transition-colors">
          <Search className="ml-4 text-stone-400 flex-shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author, ISBN..."
            className="flex-1 px-3 py-3 bg-transparent outline-none text-stone-800 text-sm"
          />
          <button type="submit" className="bg-amber-800 text-white text-sm font-semibold px-4 py-3 hover:bg-amber-900 transition-colors">
            Search
          </button>
        </form>
        <BookFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-stone-400 text-sm mb-5">
          {books.length} book{books.length !== 1 ? 's' : ''} found
          {query && ` for "${query}"`}
        </p>
      )}

      <BookGrid books={books} loading={loading} emptyMessage="No books match your search. Try different filters." />
    </div>
  )
}