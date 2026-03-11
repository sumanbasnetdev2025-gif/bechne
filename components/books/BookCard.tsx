'use client'
import { MapPin, MessageCircle, Heart } from 'lucide-react'
import { Book, CONDITION_COLORS, CONDITION_LABELS } from '@/types/book'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { useWishlistStore } from '@/lib/store/wishlistStore'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const { toggle, has } = useWishlistStore()
  const wishlisted = has(book.id)
  const discount = getDiscountPercent(book.original_price, book.asking_price)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all relative">
      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          toggle(book.id)
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          size={14}
          className={wishlisted ? 'text-red-500 fill-red-500' : 'text-stone-400'}
        />
      </button>

      <a href={`/books/${book.id}`}>
        {/* Cover image */}
        <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
          <img
            src={book.cover_image || book.images?.[0] || ''}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = `https://placehold.co/300x400/F5F0E8/92400E?text=${encodeURIComponent(book.title)}`
            }}
          />
        </div>

        <div className="p-4">
          {/* Condition badge */}
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${CONDITION_COLORS[book.condition]}`}
          >
            {CONDITION_LABELS[book.condition]}
          </span>

          {/* Title & author */}
          <h3
            className="font-semibold text-stone-900 text-sm leading-snug mb-1 line-clamp-2"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            {book.title}
          </h3>
          <p className="text-stone-400 text-xs mb-1">{book.author}</p>

          {/* Location */}
          {book.city && (
            <div className="flex items-center gap-1 text-stone-400 text-xs mb-3">
              <MapPin size={11} />
              {book.city}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-800 font-bold text-sm">
                {formatPrice(book.asking_price)}
              </span>
              {book.original_price && (
                <span className="text-stone-300 line-through text-xs">
                  {formatPrice(book.original_price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-700 text-xs font-medium bg-amber-50 px-2 py-1 rounded-lg">
              <MessageCircle size={11} /> Chat
            </div>
          </div>

          {discount && (
            <div className="mt-1 text-emerald-600 text-xs font-medium">
              {discount}% off MRP
            </div>
          )}
        </div>
      </a>
    </div>
  )
}