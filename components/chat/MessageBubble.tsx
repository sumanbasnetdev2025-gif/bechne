import { formatRelativeTime } from '@/lib/utils'
import type { Message } from '@/types/message'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-amber-800 text-white rounded-br-sm'
              : 'bg-stone-100 text-stone-800 rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-stone-400 text-xs px-1">
          {formatRelativeTime(message.created_at)}
        </span>
      </div>
    </div>
  )
}