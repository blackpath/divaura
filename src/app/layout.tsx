import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Divaura — Exceptional Diamonds & Gemstones',
    template: '%s | Divaura',
  },
  description:
    'The world\'s finest certified diamonds and gemstones. Hand-selected, authenticated, delivered.',
  keywords: ['luxury diamonds', 'gemstones', 'certified', 'GIA', 'IGI', 'premium jewelry'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#090909] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}