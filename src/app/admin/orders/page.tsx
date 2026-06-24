'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { getAllOrders, updateOrderStatus } from '@/lib/queries/orders'
import type { OrderWithItems } from '@/lib/queries/orders'
import type { OrderRow } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const STATUSES: OrderRow['status'][] = ['pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const { isAdmin, isLoading } = useAdmin()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) getAllOrders().then((d) => { setOrders(d); setLoading(false) })
  }, [isAdmin])

  async function handleStatus(id: string, status: OrderRow['status']) {
    await updateOrderStatus(id, status)
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
    toast.success('Order updated')
  }

  if (isLoading || !isAdmin) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Orders</h1>
        <p className="text-sm text-[#B3B3B3] mt-0.5">{orders.length} total orders</p>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.08)] rounded-[20px] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(212,175,55,0.08)]">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Update'].map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#555] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/1 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-[#555]">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4"><p className="text-white">{o.full_name}</p><p className="text-xs text-[#555]">{o.phone}</p></td>
                  <td className="px-5 py-4 text-[#B3B3B3]">{formatDate(o.created_at)}</td>
                  <td className="px-5 py-4 text-[#D4AF37] font-medium">{formatPrice(o.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.payment_status} /></td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-4">
                    <select value={o.status} onChange={(e) => handleStatus(o.id, e.target.value as OrderRow['status'])} className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[rgba(212,175,55,0.4)]">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}