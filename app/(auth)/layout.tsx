export const dynamic = 'force-dynamic'

import { BookOpen } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center">
              <BookOpen size={20} color="white" />
            </div>
          </a>
          <div className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'Lora, serif' }}>Bechne</div>
          <div className="text-stone-400 text-sm mt-1">Nepal's book exchange community</div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}