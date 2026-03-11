import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: start or get a conversation, then send the first message
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sellerId, bookId, message } = await req.json()

  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId is required' }, { status: 400 })
  }

  if (user.id === sellerId) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
  }

  // Upsert conversation (buyer_id, seller_id, book_id must be unique together)
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .upsert(
      { buyer_id: user.id, seller_id: sellerId, book_id: bookId || null },
      { onConflict: 'buyer_id,seller_id,book_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (convErr) {
    return NextResponse.json({ error: convErr.message }, { status: 500 })
  }

  // Send the first message if provided
  if (message?.trim()) {
    await supabase.from('messages').insert({
      conversation_id: conv.id,
      sender_id: user.id,
      content: message.trim(),
    })
    await supabase
      .from('conversations')
      .update({
        last_message: message.trim(),
        last_message_at: new Date().toISOString(),
        seller_unread: (conv.seller_unread || 0) + 1,
      })
      .eq('id', conv.id)
  }

  return NextResponse.json({ conversationId: conv.id })
}