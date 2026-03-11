'use client'
import { BookOpen, LayoutDashboard, List, MessageCircle, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const NAV = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { href: '/dashboard/listings', icon: <List size={18} />, label: 'My Listings' },
  { href: '/messages', icon: <MessageCircle size={18} />, label: 'Messages' },
  { href: '/dashboard/profile', icon: <User size={18} />, label: 'Profile' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <div className="sticky top-24">
            <a href="/" className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 bg-amber-800 rounded-lg flex items-center justify-center">
                <BookOpen size={14} color="white" />
              </div>
              <span className="font-bold text-amber-900" style={{ fontFamily: 'Lora, serif' }}>Bechne</span>
            </a>

            {/* Profile mini */}
            {profile && (
              <div className="flex items-center gap-2 mb-6 px-3 py-3 bg-stone-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold flex-shrink-0">
                  {profile.full_name?.[0] || '?'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-800 truncate">{profile.full_name}</div>
                  <div className="text-xs text-stone-400 truncate">{profile.city || 'Set your city'}</div>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-amber-50 hover:text-amber-800 transition-colors text-sm font-medium">
                  {item.icon} {item.label}
                </a>
              ))}
              <button onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium mt-4">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}