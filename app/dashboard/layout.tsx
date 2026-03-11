'use client'
export const dynamic = 'force-dynamic'

import { BookOpen, LayoutDashboard, List, MessageCircle, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/listings', icon: List, label: 'My Listings' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/dashboard/profile', icon: User, label: 'Edit Profile' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  if (!loading && !user) {
    router.push('/login?redirectTo=/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-stone-100 p-4 mb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-sm flex-shrink-0">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    : getInitials(profile?.full_name)
                  }
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-stone-800 text-sm truncate">{profile?.full_name || 'Your Name'}</div>
                  <div className="text-xs text-stone-400 truncate">{profile?.city || 'Set your city'}</div>
                </div>
              </div>
            </div>
            <nav className="bg-white rounded-2xl border border-stone-100 p-2 space-y-1">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-amber-50 hover:text-amber-800 transition-colors text-sm font-medium">
                  <item.icon size={16} />
                  {item.label}
                </a>
              ))}
              <hr className="border-stone-100 my-1" />
              <button onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                <LogOut size={16} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}