import { BookCard } from './BookCard'
import { BookCardSkeleton } from '@/components/ui/Skeleton'
import type { Book } from '@/types/book'

interface BookGridProps {
  books: Book[]
  loading?: boolean
  emptyMessage?: string
}

export function BookGrid({
  books,
  loading = false,
  emptyMessage = 'No books found.',
}: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!books.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-stone-500 text-lg">{emptyMessage}</p>
        <a
          href="/sell"
          className="inline-block mt-4 text-amber-800 font-medium hover:underline"
        >
          Be the first to list a book →
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}