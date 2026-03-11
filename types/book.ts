export type BookCondition = 'like_new' | 'good' | 'fair' | 'acceptable'
export type BookStatus = 'available' | 'sold' | 'inactive'
export type DeliveryType = 'pickup' | 'shipping' | 'both'

export interface Book {
  id: string
  seller_id: string
  title: string
  author: string
  description?: string
  isbn?: string
  category_id?: number
  language: string
  original_price?: number
  asking_price: number
  condition: BookCondition
  images: string[]
  cover_image?: string
  status: BookStatus
  edition?: string
  publisher?: string
  year_published?: number
  pages?: number
  city?: string
  state?: string
  delivery_type: DeliveryType
  views: number
  created_at: string
  updated_at: string
  // Joined relations
  profiles?: Profile
  categories?: Category
}

export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
}

export const CONDITION_LABELS: Record<BookCondition, string> = {
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  acceptable: 'Acceptable',
}

export const CONDITION_COLORS: Record<BookCondition, string> = {
  like_new: 'bg-emerald-100 text-emerald-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-amber-100 text-amber-700',
  acceptable: 'bg-red-100 text-red-700',
}

export const DELIVERY_LABELS: Record<DeliveryType, string> = {
  pickup: '🤝 Local Pickup Only',
  shipping: '📦 Shipping Available',
  both: '🤝 Pickup or 📦 Shipping',
}