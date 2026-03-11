'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, Conversation } from '@/types/message'

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!conversationId) return

    // Initial fetch
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data as Message[]) || [])
        setLoading(false)
      })

    // Realtime subscription
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      })

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId)

      return { error }
    },
    [conversationId]
  )

  return { messages, loading, sendMessage }
}

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    supabase
      .from('conversations')
      .select(
        `*, books(id, title, cover_image, asking_price, status),
         buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
         seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)`
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })
      .then(({ data }) => {
        setConversations((data as Conversation[]) || [])
        setLoading(false)
      })

    // Realtime for new messages
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        () => {
          // Re-fetch on any update
          supabase
            .from('conversations')
            .select(
              `*, books(id, title, cover_image, asking_price, status),
               buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
               seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)`
            )
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
            .order('last_message_at', { ascending: false })
            .then(({ data }) =>
              setConversations((data as Conversation[]) || [])
            )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { conversations, loading }
}