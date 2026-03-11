export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  book_id?: string
  last_message?: string
  last_message_at: string
  buyer_unread: number
  seller_unread: number
  created_at: string
  // Joined
  books?: {
    id: string
    title: string
    cover_image?: string
    asking_price: number
    status: string
  }
  buyer?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  seller?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}