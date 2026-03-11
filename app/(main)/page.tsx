export const dynamic = 'force-dynamic'
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ArrowRight, Star, MessageCircle, MapPin, RefreshCw, X, BookOpen } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useBooks } from '@/lib/hooks/useBooks'
import { BookCard } from '@/components/books/BookCard'
import { BookCardSkeleton } from '@/components/ui/Skeleton'

const CATEGORIES = [
  { name: 'Fiction', slug: 'fiction', icon: '📖', count: 243 },
  { name: 'Science & Tech', slug: 'science-technology', icon: '🔬', count: 187 },
  { name: 'Self Help', slug: 'self-help', icon: '💡', count: 156 },
  { name: 'History', slug: 'history', icon: '🏛️', count: 98 },
  { name: 'Academic', slug: 'academic', icon: '🎓', count: 312 },
  { name: 'Biography', slug: 'biography', icon: '👤', count: 74 },
  { name: 'Comics', slug: 'comics-manga', icon: '🎭', count: 89 },
  { name: 'Business', slug: 'business', icon: '💼', count: 121 },
]

const ALL_SUGGESTIONS = [
  'Atomic Habits', 'The Alchemist', 'Sapiens', 'Rich Dad Poor Dad',
  'Harry Potter', 'Ikigai', 'The Psychology of Money', 'Deep Work',
  'Think and Grow Rich', 'NCERT Physics', 'NCERT Chemistry',
  'Wings of Fire', 'The Monk Who Sold His Ferrari',
]

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { books, loading } = useBooks({ limit: 8 })

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Real-time suggestions
  useEffect(() => {
    if (query.trim().length < 1) { setSuggestions([]); setShowSuggestions(false); return }
    const filtered = ALL_SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    setSuggestions(filtered.slice(0, 6))
    setShowSuggestions(filtered.length > 0)
    setActiveSuggestion(-1)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = (q: string) => { setShowSuggestions(false); router.push(`/search?q=${encodeURIComponent(q)}`) }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) doSearch(query) }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestion((p) => Math.max(p - 1, -1)) }
    else if (e.key === 'Enter' && activeSuggestion >= 0) { e.preventDefault(); doSearch(suggestions[activeSuggestion]) }
    else if (e.key === 'Escape') setShowSuggestions(false)
  }
  const gatedNav = (path: string) => {
    if (!user) router.push(`/login?redirectTo=${encodeURIComponent(path)}`)
    else router.push(path)
  }

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden py-12 sm:py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-amber-100/60 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-5">
            <span>🇳🇵</span> Nepal's book exchange community
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-5">
            Give books a<em className="text-amber-700 not-italic"> second </em>life.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed">
            Find a book you love, message the seller directly, and agree on a deal — simple, personal, and no middleman.
          </p>
          <p className="text-stone-400 text-xs sm:text-sm mb-8 max-w-xl mx-auto">
            Pay however you want — cash on meetup, eSewa, Khalti, or bank transfer.
          </p>

          {/* REAL-TIME SEARCH */}
          <div ref={searchRef} className="relative max-w-2xl mx-auto mb-5">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white border-2 border-stone-200 rounded-2xl shadow-lg hover:border-amber-400 focus-within:border-amber-500 transition-colors">
                <Search className="ml-4 text-stone-400 flex-shrink-0" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search by title, author..."
                  className="flex-1 px-3 py-3.5 text-stone-800 bg-transparent outline-none text-sm sm:text-base min-w-0"
                  autoComplete="off"
                />
                {query && (
                  <button type="button" onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }} className="p-2 text-stone-300 hover:text-stone-500">
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="m-2 bg-amber-800 text-white font-semibold px-3 sm:px-5 py-2.5 rounded-xl hover:bg-amber-900 transition-colors text-sm whitespace-nowrap flex-shrink-0">
                  Search
                </button>
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50">
                {suggestions.map((s, i) => (
                  <button key={s} onMouseDown={() => { setQuery(s); doSearch(s) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${i === activeSuggestion ? 'bg-amber-50 text-amber-800' : 'text-stone-700 hover:bg-stone-50'}`}>
                    <Search size={13} className="text-stone-300 flex-shrink-0" />
                    <span>
                      {s.split(new RegExp(`(${query})`, 'gi')).map((part, j) =>
                        part.toLowerCase() === query.toLowerCase()
                          ? <strong key={j} className="text-amber-800">{part}</strong>
                          : part
                      )}
                    </span>
                  </button>
                ))}
                <div className="px-4 py-2 border-t border-stone-50">
                  <button onMouseDown={() => doSearch(query)} className="text-xs text-amber-700 font-medium hover:text-amber-900">
                    Search all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-stone-400 text-xs sm:text-sm">
            <span>Popular:</span>
            {['Atomic Habits', 'Harry Potter', 'Ikigai', 'The Alchemist'].map((t) => (
              <button key={t} onClick={() => doSearch(t)} className="hover:text-amber-700 transition-colors hover:underline">{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-8 sm:py-10 border-y border-amber-100 bg-amber-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-amber-100 text-center">
            {[
              { value: '12,000+', label: 'Books Listed' },
              { value: '5,400+', label: 'Readers' },
              { value: 'Rs. 8.2L+', label: 'Saved' },
            ].map((s) => (
              <div key={s.label} className="py-3 sm:py-4 px-2">
                <div className="text-lg sm:text-3xl font-bold text-amber-800 mb-0.5">{s.value}</div>
                <div className="text-stone-500 text-xs sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-stone-900 mb-1">Browse by Category</h2>
              <p className="text-stone-500 text-xs sm:text-sm hidden sm:block">Find exactly what you're looking for</p>
            </div>
            <a href="/books" className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium text-xs sm:text-sm flex-shrink-0">
              View all <ArrowRight size={13} />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <a key={cat.slug} href={`/categories/${cat.slug}`}
                className="group bg-white border border-stone-100 rounded-2xl p-3 sm:p-5 hover:border-amber-200 hover:shadow-md transition-all">
                <div className="text-2xl sm:text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-stone-800 group-hover:text-amber-800 transition-colors text-sm sm:text-base">{cat.name}</div>
                <div className="text-stone-400 text-xs mt-0.5">{cat.count} books</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY LISTED — REAL DATA FROM SUPABASE */}
      <section className="py-10 sm:py-16 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-3xl font-bold text-stone-900 mb-1">Recently Listed</h2>
              <p className="text-stone-500 text-xs sm:text-sm hidden sm:block">Chat with sellers directly — no checkout needed</p>
            </div>
            <a href="/books" className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium text-xs sm:text-sm flex-shrink-0">
              View all <ArrowRight size={13} />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-stone-700 font-semibold text-lg mb-2">No books listed yet</h3>
              <p className="text-stone-400 text-sm mb-6">Be the first to list a book!</p>
              <button onClick={() => gatedNav('/sell')}
                className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-900 transition-colors text-sm">
                <BookOpen size={16} /> List a Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">How Bechne Works</h2>
          <p className="text-stone-500 mb-10 max-w-xl mx-auto text-sm sm:text-base">No middleman. No checkout. Just two people who love books.</p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-left sm:text-center">
            {[
              { step: '01', icon: '📸', title: 'List Your Book', desc: 'Take photos, set an asking price, and your listing goes live in minutes. Free forever.' },
              { step: '02', icon: '💬', title: 'Chat Directly', desc: 'Interested buyers message you in-app. Negotiate, answer questions, and agree on a deal.' },
              { step: '03', icon: '🤝', title: 'Meet or Ship', desc: 'Exchange the book in person or ship it. Pay by cash, eSewa, or Khalti — whatever works.' },
            ].map((item) => (
              <div key={item.step} className="flex sm:block items-start gap-4 sm:gap-0 relative">
                <div className="text-4xl sm:text-7xl font-bold text-stone-100 sm:absolute sm:-top-4 sm:left-0 select-none flex-shrink-0">{item.step}</div>
                <div className="sm:relative sm:pt-6">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-4">{item.icon}</div>
                  <h3 className="text-base sm:text-xl font-bold text-stone-900 mb-1.5 sm:mb-3">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NO PAYMENT */}
      <section className="py-10 sm:py-12 px-4 bg-amber-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Why no online payment?</h2>
          <p className="text-amber-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We keep it simple. Books are often sold locally — a quick meetup works perfectly.
            When shipping, buyers and sellers agree on eSewa, Khalti, or bank transfer. No fees, no delays.
          </p>
          <div className="flex justify-center gap-8 sm:gap-12 mt-8">
            {[
              { icon: <MessageCircle size={22} />, label: 'Direct Chat' },
              { icon: <Star size={22} />, label: 'Zero Fees' },
              { icon: <RefreshCw size={22} />, label: 'Your Terms' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="text-amber-300">{item.icon}</div>
                <div className="text-xs sm:text-sm font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 mb-3 sm:mb-4">Have books collecting dust?</h2>
          <p className="text-stone-500 text-base sm:text-lg mb-6 sm:mb-8">List them free. Reach thousands of readers. Earn directly.</p>
          <button onClick={() => gatedNav('/sell')}
            className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-amber-900 transition-colors text-base sm:text-lg">
            List a Book Free <ArrowRight size={18} />
          </button>
          <p className="text-stone-400 text-xs sm:text-sm mt-4">Free to list · No commission · No fees ever</p>
          {!user && (
            <p className="text-stone-400 text-xs mt-2">
              <a href="/login" className="text-amber-700 underline hover:text-amber-900">Login</a> or{' '}
              <a href="/signup" className="text-amber-700 underline hover:text-amber-900">sign up</a> to start selling
            </p>
          )}
        </div>
      </section>
    </div>
  )
}