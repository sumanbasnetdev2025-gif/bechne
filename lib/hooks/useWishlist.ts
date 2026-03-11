'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    supabase
      .from('wishlists')
      .select('book_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setWishlist(data?.map((w) => w.book_id) || [])
        setLoading(false)
      })
  }, [userId])

  const toggle = async (bookId: string) => {
    if (!userId) return
    if (wishlist.includes(bookId)) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId)
      setWishlist((prev) => prev.filter((id) => id !== bookId))
    } else {
      await supabase
        .from('wishlists')
        .insert({ user_id: userId, book_id: bookId })
      setWishlist((prev) => [...prev, bookId])
    }
  }

  const isWishlisted = (bookId: string) => wishlist.includes(bookId)

  return { wishlist, loading, toggle, isWishlisted }
}