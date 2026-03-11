'use client'
import { useParams } from 'next/navigation'
import { BookGrid } from '@/components/books/BookGrid'
import { useBooks } from '@/lib/hooks/useBooks'

const CATEGORY_META: Record<string, { name: string; icon: string; desc: string }> = {
  'fiction':             { name: 'Fiction', icon: '📖', desc: 'Novels, short stories, and imaginative tales' },
  'non-fiction':         { name: 'Non-Fiction', icon: '📰', desc: 'True stories, essays, and factual accounts' },
  'science-technology':  { name: 'Science & Technology', icon: '🔬', desc: 'Science, engineering, programming, and tech' },
  'history':             { name: 'History', icon: '🏛️', desc: 'Past events, civilizations, and biographies' },
  'biography':           { name: 'Biography', icon: '👤', desc: 'Life stories of remarkable people' },
  'self-help':           { name: 'Self Help', icon: '💡', desc: 'Personal growth, habits, and productivity' },
  'children':            { name: "Children's Books", icon: '🧒', desc: 'Stories and learning for young readers' },
  'comics-manga':        { name: 'Comics & Manga', icon: '🎭', desc: 'Graphic novels, comics, and manga' },
  'academic':            { name: 'Academic', icon: '🎓', desc: 'Textbooks, study materials, and research' },
  'religion-spirituality': { name: 'Religion & Spirituality', icon: '🕊️', desc: 'Faith, mindfulness, and spiritual texts' },
  'business':            { name: 'Business', icon: '💼', desc: 'Entrepreneurship, finance, and management' },
  'arts-photography':    { name: 'Arts & Photography', icon: '🎨', desc: 'Visual arts, design, and photography' },
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const meta = CATEGORY_META[slug] || { name: slug, icon: '📚', desc: '' }
  const { books, loading } = useBooks({ category: slug })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{meta.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">{meta.name}</h1>
            {meta.desc && <p className="text-stone-500 mt-1">{meta.desc}</p>}
          </div>
        </div>
        {!loading && (
          <p className="text-stone-400 text-sm">{books.length} books available</p>
        )}
      </div>

      <BookGrid books={books} loading={loading} emptyMessage={`No ${meta.name} books listed yet. Be the first!`} />
    </div>
  )
}