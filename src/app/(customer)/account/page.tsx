'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { getOrdersByUser } from '@/lib/queries/orders'
import type { OrderWithItems } from '@/lib/queries/orders'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatPrice, formatDate } from '@/lib/utils'

type Tab = 'orders' | 'profile'

export default function AccountPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login')
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) getOrdersByUser(user.id).then((d) => { setOrders(d); setLoading(false) })
  }, [user])

  if (isLoading || !user) return <LoadingSpinner className="py-40" />

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-5xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>My Account</h1>
        <p className="text-[#B3B3B3] text-sm mb-12">{user.email}</p>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[rgba(212,175,55,0.1)] mb-10">
          {(['orders', 'profile'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="relative pb-4 text-sm capitalize tracking-wide transition-colors">
              <span className={tab === t ? 'text-[#D4AF37]' : 'text-[#B3B3B3] hover:text-white'}>{t}</span>
              {tab === t && (
                <motion.div layoutId="account-tab" className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          loading ? <LoadingSpinner /> :
          orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-20 h-20 rounded-full border border-[rgba(212,175,55,0.1)] flex items-center justify-center">
                <Package className="w-9 h-9 text-[#D4AF37] opacity-30" />
              </div>
              <p className="text-white font-medium">No orders yet</p>
              <p className="text-sm text-[#B3B3B3]">Your orders will appear here once you place one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-mono text-[#555]">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-[#B3B3B3] mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.payment_status} />
                      <span className="text-[#D4AF37] font-semibold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[#B3B3B3]">{item.product_name} × {item.quantity}</span>
                        <span className="text-white">{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {tab === 'profile' && (
          <div className="glass-card p-8 max-w-sm space-y-5">
            {[
              { label: 'Email', value: user.email },
              { label: 'Member since', value: formatDate(user.created_at) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-1.5">{label}</p>
                <p className="text-sm text-white">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}