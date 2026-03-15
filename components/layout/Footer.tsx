import { BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-stone-100 py-10 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-800 rounded-md flex items-center justify-center">
                <BookOpen size={14} color="white" />
              </div>
              <span className="font-bold text-amber-900" style={{ fontFamily: 'Lora, serif' }}>Bechne</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Nepal's community for buying and selling pre-loved books. No fees, no middleman.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-stone-700 mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><a href="/books" className="hover:text-amber-800 transition-colors">Browse Books</a></li>
              <li><a href="/categories" className="hover:text-amber-800 transition-colors">Categories</a></li>
              <li><a href="/search" className="hover:text-amber-800 transition-colors">Search</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-stone-700 mb-3 text-sm">Selling</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><a href="/sell" className="hover:text-amber-800 transition-colors">List a Book</a></li>
              <li><a href="/dashboard/listings" className="hover:text-amber-800 transition-colors">My Listings</a></li>
              <li><a href="/dashboard" className="hover:text-amber-800 transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-stone-700 mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><a href="/about" className="hover:text-amber-800 transition-colors">About</a></li>
              <li><a href="/privacy" className="hover:text-amber-800 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-amber-800 transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-amber-800 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-stone-400 text-sm">© {new Date().getFullYear()} Bechne. <br/> For Everyone at every corner of the world</p>
          <p className="text-stone-400 text-xs">Free to list · No commission · No fees ever</p>
        </div>
      </div>
    </footer>
  )
}