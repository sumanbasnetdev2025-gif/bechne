'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ConversationList } from '@/components/chat/ConversationList'
import { useConversations } from '@/lib/hooks/useMessages'
import { createClient } from '@/lib/supabase/client'
import type { Conversation } from '@/types/message'

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { user } = useAuth()
  const { conversations } = useConversations(user?.id || '')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!conversationId) return
    supabase
      .from('conversations')
      .select(`*, books(id, title, cover_image, asking_price, status),
        buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
        seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)`)
      .eq('id', conversationId)
      .single()
      .then(({ data }) => setConversation(data as Conversation))
  }, [conversationId])

  if (!user || !conversation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-4 h-[calc(100vh-140px)]">

        {/* Sidebar: conversation list (desktop) */}
        <div className="hidden md:block w-72 flex-shrink-0 bg-white rounded-2xl border border-stone-100 overflow-y-auto">
          <div className="p-4 border-b border-stone-50">
            <h2 className="font-bold text-stone-900 text-sm">Messages</h2>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={conversationId}
            currentUserId={user.id}
          />
        </div>

        {/* Chat window */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-100 overflow-hidden flex flex-col">
          <ChatWindow conversation={conversation} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}