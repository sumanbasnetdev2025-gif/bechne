import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[] // book IDs
  add: (bookId: string) => void
  remove: (bookId: string) => void
  toggle: (bookId: string) => void
  has: (bookId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (bookId) =>
        set((state) => ({
          items: state.items.includes(bookId)
            ? state.items
            : [...state.items, bookId],
        })),
      remove: (bookId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== bookId),
        })),
      toggle: (bookId) => {
        if (get().items.includes(bookId)) {
          get().remove(bookId)
        } else {
          get().add(bookId)
        }
      },
      has: (bookId) => get().items.includes(bookId),
      clear: () => set({ items: [] }),
    }),
    { name: 'bechne-wishlist' }
  )
)