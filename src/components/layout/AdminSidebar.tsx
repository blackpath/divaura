'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Gem, ShoppingBag, CreditCard, MessageSquare, LogOut } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { useAuth } from '@/lib/context/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Gem },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/tickets', label: 'Tickets', icon: MessageSquare },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    await signOut(); router.push('/admin-login')
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0c0c0c] border-r border-[rgba(212,175,55,0.08)]">
      <div className="px-6 py-7 border-b border-[rgba(212,175,55,0.08)]">
        <Logo size="sm" />
        <p className="text-[9px] tracking-[0.35em] uppercase text-[#555] mt-2">Control Panel</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-150 relative overflow-hidden',
                  isActive
                    ? 'text-[#D4AF37] bg-[rgba(212,175,55,0.07)]'
                    : 'text-[#B3B3B3] hover:text-white hover:bg-white/3'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-active"
                    className="absolute left-0 inset-y-0 w-0.5 bg-[#D4AF37] rounded-full"
                  />
                )}
                <item.icon className="w-4 h-4" />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[rgba(212,175,55,0.08)]">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#555] hover:text-white hover:bg-white/3 transition-all">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}