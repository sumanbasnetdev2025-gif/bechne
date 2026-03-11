export interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  phone?: string
  city?: string
  state?: string
  bio?: string
  is_verified: boolean
  created_at: string
  updated_at?: string
}