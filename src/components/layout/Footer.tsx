import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { Mail, Phone } from 'lucide-react'

// Simple inline Instagram icon to avoid missing export from lucide-react
const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)

export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(212,175,55,0.1)] bg-[#080808]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-5 text-sm text-[#B3B3B3] leading-relaxed max-w-xs">
              Exceptional certified diamonds and gemstones, curated for those who understand that rarity is not enough — it must also be beautiful.
            </p>
            <div className="flex items-center gap-5 mt-7">
              {[
                { icon: Mail, href: 'mailto:hello@divaura.com' },
                { icon: Phone, href: 'tel:+919999999999' },
                { icon: Instagram, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} className="w-9 h-9 rounded-xl border border-[rgba(212,175,55,0.15)] flex items-center justify-center text-[#B3B3B3] hover:text-[#D4AF37] hover:border-[rgba(212,175,55,0.4)] transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Collection', links: [{ label: 'Diamonds', href: '/products?category=diamond' }, { label: 'Rubies', href: '/products?category=ruby' }, { label: 'Sapphires', href: '/products?category=sapphire' }, { label: 'Emeralds', href: '/products?category=emerald' }, { label: 'Rare Gems', href: '/products' }] },
            { title: 'Account', links: [{ label: 'My Orders', href: '/account' }, { label: 'My Account', href: '/account' }, { label: 'Support', href: '/tickets' }, { label: 'Sign In', href: '/auth/login' }] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-5 font-medium">{col.title}</p>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#B3B3B3] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-gold mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#555] tracking-wider">© {new Date().getFullYear()} Divaura. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-60" />
            <span className="text-xs text-[#555] tracking-[0.25em] uppercase">Certified Luxury Gemstones</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  )
}