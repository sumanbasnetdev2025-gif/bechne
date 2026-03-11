'use client'
export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { BookGrid } from '@/components/books/BookGrid'
import { BookFilters } from '@/components/books/BookFilters'
import { useBooks } from '@/lib/hooks/useBooks'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [search, setSearch] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState({})

  const { books, loading } = useBooks({ search: query, ...filters })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(search)
    const url = new URL(window.location.href)
    url.searchParams.set('q', search)
    window.history.pushState({}, '', url.toString())
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Search Books</h1>
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="flex-1 flex items-center bg-white border-2 border-stone-200 rounded-xl overflow-hidden hover:border-amber-400 focus-within:border-amber-400 transition-colors">
            <Search className="ml-4 text-stone-400 flex-shrink-0" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, ISBN..."
              className="flex-1 px-3 py-3.5 bg-transparent outline-none text-stone-800"
            />
          </div>
          <button type="submit" className="bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-900 transition-colors">
            Search
          </button>
        </form>
        <BookFilters filters={filters} onChange={setFilters} />
      </div>

      {!loading && query && (
        <p className="text-stone-500 text-sm mb-6">
          {books.length} result{books.length !== 1 ? "s" : ""} for <strong>"{query}"</strong>
        </p>
      )}

      <BookGrid books={books} loading={loading} emptyMessage={query ? "No books found for " + query + ". Try a different search." : "Enter a search term above."} />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-10 bg-stone-100 rounded-xl animate-pulse mb-6 w-48" />
        <div className="h-14 bg-stone-100 rounded-xl animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}