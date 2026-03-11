import { formatRelativeTime, getInitials } from '@/lib/utils'
import type { Conversation } from '@/types/message'

interface ConversationListProps {
  conversations: Conversation[]
  activeId?: string
  currentUserId: string
}

export function ConversationList({
  conversations,
  activeId,
  currentUserId,
}: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="p-6 text-center text-stone-400 text-sm">
        <div className="text-3xl mb-2">💬</div>
        No conversations yet.
        <br />
        <a href="/books" className="text-amber-700 hover:underline mt-1 inline-block">
          Browse books to start chatting
        </a>
      </div>
    )
  }

  return (
    <div className="divide-y divide-stone-50">
      {conversations.map((conv) => {
        const isBuyer = conv.buyer_id === currentUserId
        const other = isBuyer ? conv.seller : conv.buyer
        const unread = isBuyer ? conv.buyer_unread : conv.seller_unread

        return (
          <a
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-stone-50 transition-colors ${
              activeId === conv.id ? 'bg-amber-50' : ''
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-sm flex-shrink-0">
              {other?.avatar_url ? (
                <img
                  src={other.avatar_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(other?.full_name)
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-stone-800 text-sm truncate">
                  {other?.full_name || 'Unknown'}
                </span>
                <span className="text-stone-400 text-xs flex-shrink-0 ml-2">
                  {formatRelativeTime(conv.last_message_at)}
                </span>
              </div>
              {conv.books && (
                <div className="text-xs text-amber-700 mb-0.5 truncate">
                  📚 {conv.books.title}
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-stone-500 text-xs truncate">
                  {conv.last_message || 'No messages yet'}
                </p>
                {unread > 0 && (
                  <span className="bg-amber-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                    {unread}
                  </span>
                )}
              </div>
            </div>
          </a>
        )
      })}
    </div>
  )
}