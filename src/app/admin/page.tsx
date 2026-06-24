'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, ShoppingBag, CreditCard, MessageSquare, TrendingUp } from 'lucide-react'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { getAdminStats } from '@/lib/queries/orders'
import { formatPrice } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function AdminDashboardPage() {
  const { isAdmin, isLoading } = useAdmin()
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null)

  useEffect(() => {
    if (isAdmin) getAdminStats().then(setStats)
  }, [isAdmin])

  if (isLoading || !isAdmin) return <LoadingSpinner />

  const cards = [
    { label: 'Total Revenue', value: stats ? formatPrice(stats.revenue) : '—', icon: TrendingUp, color: '#D4AF37', glow: 'rgba(212,175,55,0.15)' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: '#60A5FA', glow: 'rgba(96,165,250,0.15)' },
    { label: 'Pending Payments', value: stats?.pendingPayments ?? '—', icon: CreditCard, color: '#FBBF24', glow: 'rgba(251,191,36,0.15)' },
    { label: 'Open Tickets', value: stats?.openTickets ?? '—', icon: MessageSquare, color: '#A78BFA', glow: 'rgba(167,139,250,0.15)' },
    { label: 'Active Products', value: stats?.totalProducts ?? '—', icon: Gem, color: '#34D399', glow: 'rgba(52,211,153,0.15)' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
        <p className="text-sm text-[#B3B3B3] mt-1">Store performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111] border border-[rgba(212,175,55,0.08)] rounded-[20px] p-5 relative overflow-hidden group hover:border-[rgba(212,175,55,0.2)] transition-colors"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${card.glow} 0%, transparent 70%)` }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] text-[#555] uppercase tracking-[0.2em]">{card.label}</p>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-light" style={{ color: card.color }}>{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}