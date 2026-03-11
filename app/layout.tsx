import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bechne — Buy & Sell Second Hand Books in Nepal',
  description: "Nepal's community for buying and selling pre-loved books. No fees, no middleman.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1917',
              color: '#fafaf9',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}