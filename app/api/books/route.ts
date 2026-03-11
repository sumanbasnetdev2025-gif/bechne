import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const condition = searchParams.get('condition')
  const limit = parseInt(searchParams.get('limit') || '20')

  let query = supabase
    .from('books')
    .select('*, profiles(id, full_name, avatar_url, city, is_verified), categories(id, name, slug, icon)')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (search) query = query.textSearch('title', search.split(' ').join(' & '))
  if (category) query = query.eq('categories.slug', category)
  if (condition) query = query.eq('condition', condition)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ books: data })
}