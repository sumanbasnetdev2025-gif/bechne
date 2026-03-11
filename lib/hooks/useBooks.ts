'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Book } from '@/types/book'

interface UseBooksOptions {
  category?: string
  search?: string
  limit?: number
  sellerId?: string
  city?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
}

export function useBooks(options: UseBooksOptions = {}) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [
    options.category,
    options.search,
    options.sellerId,
    options.city,
    options.condition,
    options.minPrice,
    options.maxPrice,
  ])

  async function fetchBooks() {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('books')
      .select(
        `*, profiles(id, full_name, avatar_url, city, is_verified), categories(id, name, slug, icon)`
      )
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (options.search) {
      query = query.textSearch(
        'title',
        options.search.split(' ').join(' & ')
      )
    }
    if (options.sellerId) query = query.eq('seller_id', options.sellerId)
    if (options.city) query = query.ilike('city', `%${options.city}%`)
    if (options.condition) query = query.eq('condition', options.condition)
    if (options.minPrice) query = query.gte('asking_price', options.minPrice)
    if (options.maxPrice) query = query.lte('asking_price', options.maxPrice)
    if (options.limit) query = query.limit(options.limit)

    const { data, error } = await query

    if (error) setError(error.message)
    else setBooks((data as Book[]) || [])
    setLoading(false)
  }

  return { books, loading, error, refetch: fetchBooks }
}