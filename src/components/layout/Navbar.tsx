'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/products', label: 'Collection' },
  { href: '/tickets', label: 'Support' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCart()
  const { user, isAdmin, signOut } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[rgba(9,9,9,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <Logo size="sm" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-200 py-1',
                    pathname.startsWith(link.href) ? 'text-[#D4AF37]' : 'text-[#B3B3B3] hover:text-white'
                  )}
                >
                  {link.label}
                  {pathname.startsWith(link.href) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4AF37]"
                    />
                  )}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" className="text-xs tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#E8CC6A] transition-colors">
                  Admin
                </Link>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link href="/cart" className="relative p-2.5 text-[#B3B3B3] hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#D4AF37] text-[10px] font-bold text-black flex items-center justify-center"
                    >
                      {count > 9 ? '9+' : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/account" className="p-2.5 text-[#B3B3B3] hover:text-white transition-colors">
                    <User className="w-5 h-5" />
                  </Link>
                  <button onClick={handleSignOut} className="p-2.5 text-[#B3B3B3] hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex items-center text-xs tracking-[0.15em] uppercase border border-[rgba(212,175,55,0.25)] hover:border-[rgba(212,175,55,0.6)] text-[#B3B3B3] hover:text-white px-5 py-2 rounded-xl transition-all duration-200"
                >
                  Sign in
                </Link>
              )}

              <button
                className="md:hidden p-2.5 text-[#B3B3B3] hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 bg-[rgba(9,9,9,0.97)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.1)] py-6 px-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm tracking-[0.2em] uppercase text-[#B3B3B3] hover:text-white" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/account" className="text-sm text-[#B3B3B3] hover:text-white" onClick={() => setMobileOpen(false)}>My Account</Link>
                <button onClick={handleSignOut} className="text-left text-sm text-[#B3B3B3] hover:text-white">Sign out</button>
              </>
            ) : (
              <Link href="/auth/login" className="text-sm text-[#B3B3B3] hover:text-white" onClick={() => setMobileOpen(false)}>Sign in</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}