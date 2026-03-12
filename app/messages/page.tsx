'use client'
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useConversations } from '@/lib/hooks/useMessages'
import { ConversationList } from '@/components/chat/ConversationList'

function MessagesContent() {
  const { user } = useAuth()
  const { conversations, loading } = useConversations(user?.id || '')

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-6" style={{ fontFamily: 'Lora, serif' }}>
        Messages
      </h1>
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ConversationList conversations={conversations} currentUserId={user?.id || ''} />
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="h-8 w-36 bg-stone-100 rounded-xl animate-pulse mb-6" />
        <div className="bg-white rounded-2xl border border-stone-100 p-8 flex justify-center">
          <div className="w-7 h-7 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}