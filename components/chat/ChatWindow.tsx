'use client'
import { useEffect, useRef, useState } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { useMessages } from '@/lib/hooks/useMessages'
import { getInitials, formatPrice } from '@/lib/utils'
import type { Conversation } from '@/types/message'

interface ChatWindowProps {
  conversation: Conversation
  currentUserId: string
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  const { messages, loading, sendMessage } = useMessages(conversation.id)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isBuyer = conversation.buyer_id === currentUserId
  const other = isBuyer ? conversation.seller : conversation.buyer

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    await sendMessage(content, currentUserId)
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 bg-white">
        <a href="/messages" className="md:hidden p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <ArrowLeft size={18} />
        </a>
        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-sm flex-shrink-0">
          {other?.avatar_url ? (
            <img src={other.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(other?.full_name)
          )}
        </div>
        <div>
          <div className="font-semibold text-stone-800 text-sm">{other?.full_name}</div>
          {conversation.books && (
            <a
              href={`/books/${conversation.book_id}`}
              className="text-xs text-amber-700 hover:underline"
            >
              📚 {conversation.books.title} · {formatPrice(conversation.books.asking_price)}
            </a>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#FFFDF7]">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-sm">
            <div className="text-3xl mb-2">👋</div>
            Say hi! Ask about the book condition, price, or pickup details.
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-stone-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 border-2 border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-2.5 bg-amber-800 text-white rounded-xl hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-stone-300 text-xs mt-1 ml-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}