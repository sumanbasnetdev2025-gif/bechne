'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { MapPin, MessageCircle, Heart, Share2, BookOpen, Star, ChevronLeft, ChevronRight, Tag, Truck, Users, LogIn, ArrowLeft } from 'lucide-react'
import { CONDITION_MAP, DELIVERY_MAP } from './constants'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Book } from '@/types/book'
import { formatPrice } from '@/lib/utils'

export default function BookDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!bookId) return
    fetchBook()
  }, [bookId])

  async function fetchBook() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('books')
      .select('*, profiles(id, full_name, avatar_url, city, is_verified), categories(id, name, slug, icon)')
      .eq('id', bookId)
      .single()

    if (error || !data) {
      setNotFound(true)
    } else {
      setBook(data)
      // Increment views
      supabase.from('books').update({ views: (data.views || 0) + 1 }).eq('id', bookId).then(() => {})
    }
    setLoading(false)
  }

  const handleContact = async () => {
    if (!message.trim() || !user || !book) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id, sellerId: book.seller_id, message }),
      })
      if (res.ok) { setSent(true); setMessage('') }
    } catch {}
    setSending(false)
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-stone-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-stone-100 rounded-xl animate-pulse" />
          <div className="h-5 bg-stone-100 rounded-xl w-1/2 animate-pulse" />
          <div className="h-12 bg-stone-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-4">📚</div>
      <h2 className="text-2xl font-bold text-stone-900 mb-2">Book not found</h2>
      <p className="text-stone-500 mb-6">This listing may have been removed or sold.</p>
      <a href="/books" className="inline-flex items-center gap-2 bg-amber-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-900 transition-colors">
        Browse Books
      </a>
    </div>
  )

  if (!book) return null

  const cond = CONDITION_MAP[book.condition as keyof typeof CONDITION_MAP] || { label: book.condition, color: 'bg-stone-100 text-stone-700', icon: '📗' }
  const discount = book.original_price ? Math.round((1 - book.asking_price / book.original_price) * 100) : 0
  const images = book.images?.length ? book.images : [book.cover_image].filter(Boolean)
  const seller = book.profiles

  const QUICK_MESSAGES = [
    `Hi! Is "${book.title}" still available?`,
    `Can you do Rs. ${Math.round(book.asking_price * 0.85)}?`,
    `Can we meet in ${book.city}?`,
    `Can you ship to my location?`,
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-stone-500 hover:text-amber-800 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden mb-3">
            <img
              src={images[activeImage] || `https://placehold.co/400x550/F5F0E8/92400E?text=${encodeURIComponent(book.title)}`}
              alt={book.title}
              className="w-full h-full object-cover"
              suppressHydrationWarning
            />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImage((p) => Math.max(0, p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setActiveImage((p) => Math.min(images.length - 1, p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {discount}% OFF
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-amber-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {/* Category & Condition */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {book.categories && (
              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                {book.categories.icon} {book.categories.name}
              </span>
            )}
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${cond.color}`}>
              {cond.icon} {cond.label}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1" style={{ fontFamily: 'Lora, serif' }}>{book.title}</h1>
          <p className="text-stone-500 text-base mb-4">by {book.author}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-amber-800">{formatPrice(book.asking_price)}</span>
            {book.original_price && <span className="text-stone-300 line-through text-lg">{formatPrice(book.original_price)}</span>}
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-500 mb-5">
            <span className="flex items-center gap-1"><MapPin size={13} /> {book.city}{book.state ? `, ${book.state}` : ''}</span>
            <span>{book.views || 0} views</span>
          </div>

          {/* Payment note */}
          <div className="bg-amber-50 rounded-xl px-4 py-3 text-sm text-amber-800 mb-5">
            Price is negotiable. Message the seller — pay by cash or eSewa/Khalti directly.
          </div>

          {/* Delivery */}
          {book.delivery_type && (
            <div className="flex items-center gap-2 text-sm text-stone-600 mb-5">
              <Truck size={16} className="text-stone-400" />
              {DELIVERY_MAP[book.delivery_type as keyof typeof DELIVERY_MAP] || book.delivery_type}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3 mb-6">
            {user ? (
              <button onClick={() => setShowModal(true)}
                className="w-full bg-amber-800 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 text-base">
                <MessageCircle size={20} /> Contact Seller
              </button>
            ) : (
              <button onClick={() => router.push(`/login?redirectTo=/books/${book.id}`)}
                className="w-full bg-amber-800 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 text-base">
                <LogIn size={20} /> Login to Contact Seller
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={() => setWishlisted((p) => !p)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${wishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
                {wishlisted ? 'Saved' : 'Save'}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href) }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-stone-200 text-stone-600 hover:border-stone-300 font-medium text-sm transition-colors">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Book info */}
          <div className="bg-stone-50 rounded-2xl p-5 space-y-2.5 text-sm">
            <h3 className="font-semibold text-stone-800 mb-3">Book Details</h3>
            {book.language && <div className="flex justify-between"><span className="text-stone-500">Language</span><span className="text-stone-700 font-medium">{book.language}</span></div>}
            {book.publisher && <div className="flex justify-between"><span className="text-stone-500">Publisher</span><span className="text-stone-700 font-medium">{book.publisher}</span></div>}
            {book.year_published && <div className="flex justify-between"><span className="text-stone-500">Year</span><span className="text-stone-700 font-medium">{book.year_published}</span></div>}
            {book.pages && <div className="flex justify-between"><span className="text-stone-500">Pages</span><span className="text-stone-700 font-medium">{book.pages}</span></div>}
            {book.edition && <div className="flex justify-between"><span className="text-stone-500">Edition</span><span className="text-stone-700 font-medium">{book.edition}</span></div>}
          </div>

          {/* Description */}
          {book.description && (
            <div className="mt-5">
              <h3 className="font-semibold text-stone-800 mb-2">Seller's Note</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seller Card */}
      {seller && (
        <div className="mt-10 bg-white rounded-2xl border border-stone-100 p-6">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2"><Users size={16} /> About the Seller</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xl font-bold flex-shrink-0">
              {seller.avatar_url
                ? <img src={seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                : (seller.full_name?.[0] || '?')
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-800">{seller.full_name}</span>
                {seller.is_verified && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Verified</span>}
              </div>
              <div className="text-stone-400 text-sm flex items-center gap-2 mt-0.5 flex-wrap">
                {seller.city && <span className="flex items-center gap-1"><MapPin size={12} /> {seller.city}</span>}
              </div>
            </div>
            {user && (
              <button onClick={() => setShowModal(true)}
                className="bg-amber-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-900 transition-colors flex-shrink-0">
                Message
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Message Seller</h3>
                <p className="text-stone-400 text-sm">About: {book.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 text-xl leading-none">✕</button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✉️</div>
                <h4 className="font-semibold text-stone-800 mb-1">Message Sent!</h4>
                <p className="text-stone-500 text-sm mb-4">The seller will reply shortly. Check your messages.</p>
                <div className="flex gap-3">
                  <button onClick={() => router.push('/messages')} className="flex-1 bg-amber-800 text-white font-semibold py-3 rounded-xl hover:bg-amber-900 transition-colors text-sm">View Messages</button>
                  <button onClick={() => { setSent(false); setShowModal(false) }} className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-xl font-medium hover:bg-stone-50 transition-colors text-sm">Close</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-xs text-stone-500 mb-2 font-medium">Quick messages:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_MESSAGES.map((q) => (
                      <button key={q} onClick={() => setMessage(q)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${message === q ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-stone-200 text-stone-600 hover:border-amber-300'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Type your message..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-400 resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-xl font-medium hover:bg-stone-50 transition-colors text-sm">Cancel</button>
                  <button onClick={handleContact} disabled={!message.trim() || sending}
                    className="flex-1 bg-amber-800 text-white font-semibold py-3 rounded-xl hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}