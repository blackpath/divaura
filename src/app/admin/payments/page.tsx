'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ExternalLink, X } from 'lucide-react'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { useAuth } from '@/lib/context/AuthContext'
import { getAllPayments, reviewPayment } from '@/lib/queries/payments'
import type { PaymentWithOrder } from '@/lib/queries/payments'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminPaymentsPage() {
  const { isAdmin, isLoading } = useAdmin()
  const { user } = useAuth()
  const [payments, setPayments] = useState<PaymentWithOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<PaymentWithOrder | null>(null)
  const [note, setNote] = useState('')
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    if (isAdmin) getAllPayments().then((d) => { setPayments(d); setLoading(false) })
  }, [isAdmin])

  async function handleReview(status: 'approved' | 'rejected') {
    if (!user || !preview) return
    setReviewing(true)
    try {
      await reviewPayment(preview.id, status, user.id, note)
      setPayments((prev) => prev.map((p) => p.id === preview.id ? { ...p, status } : p))
      setPreview(null); setNote(''); toast.success(`Payment ${status}`)
    } catch { toast.error('Failed to update payment') }
    finally { setReviewing(false) }
  }

  if (isLoading || !isAdmin) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Payments</h1>
        <p className="text-sm text-[#B3B3B3] mt-0.5">{payments.filter((p) => p.status === 'pending').length} pending verification</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.08)] rounded-[20px] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(212,175,55,0.08)]">
              <tr>
                {['Order', 'Customer', 'Amount', 'UTR', 'Submitted', 'Status', ''].map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#555] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/1 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-[#555]">#{p.order_id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-white">{p.orders?.full_name ?? '—'}</td>
                  <td className="px-5 py-4 text-[#D4AF37] font-medium