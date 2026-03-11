'use client'
import { useState } from 'react'
import { BookOpen, MessageCircle, Menu, X, PlusCircle, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getInitials } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'

export function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const gatedNav = (path: string) => {
    setMenuOpen(false)
    if (!user) router.push(`/login?redirectTo=${encodeURIComponent(path)}`)
    else router.push(path)
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-800 rounded-lg flex items-center justify-center">
              <BookOpen size={16} color="white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-amber-900" style={{ fontFamily: 'Lora, serif' }}>
              Bechne
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/books" className="text-stone-600 hover:text-amber-800 transition-colors text-sm font-medium">Browse Books</a>
            <a href="/categories" className="text-stone-600 hover:text-amber-800 transition-colors text-sm font-medium">Categories</a>
            {user && (
              <a href="/messages" className="text-stone-600 hover:text-amber-800 transition-colors text-sm font-medium flex items-center gap-1">
                <MessageCircle size={15} /> Messages
              </a>
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => gatedNav('/sell')}
              className="flex items-center gap-1.5 bg-amber-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-900 transition-colors"
            >
              <PlusCircle size={15} /> Sell a Book
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">
                      {getInitials(profile?.full_name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-stone-700">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 z-20">
                      <a href="/dashboard" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800 transition-colors">Dashboard</a>
                      <a href="/dashboard/listings" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800 transition-colors">My Listings</a>
                      <a href="/messages" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800 transition-colors">Messages</a>
                      <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800 transition-colors">Edit Profile</a>
                      <hr className="my-1 border-stone-100" />
                      <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <a href="/login" className="text-sm font-medium text-stone-600 hover:text-amber-800 transition-colors px-3 py-2 rounded-xl hover:bg-stone-100 flex items-center gap-1.5">
                <LogIn size={15} /> Login
              </a>
            )}
          </div>

          {/* Mobile right: login icon + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <a href="/login" className="p-2 text-stone-600 hover:text-amber-800">
                <LogIn size={20} />
              </a>
            )}
            <button
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          <a href="/books" className="flex items-center py-2.5 text-stone-700 font-medium hover:text-amber-800 text-sm" onClick={() => setMenuOpen(false)}>Browse Books</a>
          <a href="/categories" className="flex items-center py-2.5 text-stone-700 font-medium hover:text-amber-800 text-sm" onClick={() => setMenuOpen(false)}>Categories</a>
          <button
            onClick={() => gatedNav('/sell')}
            className="flex items-center gap-2 py-2.5 text-amber-800 font-semibold text-sm w-full"
          >
            <PlusCircle size={16} /> Sell a Book
          </button>
          {user ? (
            <>
              <button onClick={() => gatedNav('/messages')} className="flex items-center gap-2 py-2.5 text-stone-700 font-medium hover:text-amber-800 text-sm w-full">
                <MessageCircle size={16} /> Messages
              </button>
              <a href="/dashboard" className="flex items-center py-2.5 text-stone-700 font-medium hover:text-amber-800 text-sm" onClick={() => setMenuOpen(false)}>Dashboard</a>
              <hr className="border-stone-100 my-1" />
              <button onClick={signOut} className="flex items-center py-2.5 text-red-600 font-medium text-sm w-full">Sign Out</button>
            </>
          ) : (
            <a href="/login" className="flex items-center gap-2 py-2.5 text-stone-700 font-medium hover:text-amber-800 text-sm" onClick={() => setMenuOpen(false)}>
              <LogIn size={16} /> Login / Sign Up
            </a>
          )}
        </div>
      )}
    </nav>
  )
}