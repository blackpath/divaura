'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
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
                  <td className="px-5 py-4 text-[#D4AF37] font-medium">{formatPrice(p.amount)}</td>
                  <td className="px-5 py-4 font-mono text-xs text-[#B3B3B3]">{p.utr_number}</td>
                  <td className="px-5 py-4 text-[#B3B3B3]">{formatDate(p.submitted_at)}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4">
                    <button onClick={() => { setPreview(p); setNote('') }} className="text-xs text-[#D4AF37] hover:text-[#E8CC6A] flex items-center gap-1 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#111] border border-[rgba(212,175,55,0.15)] rounded-[20px] w-full max-w-md">
              <div className="p-6 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between">
                <h2 className="text-lg font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Review Payment</h2>
                <button onClick={() => setPreview(null)} className="text-[#555] hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">Amount</p><p className="text-[#D4AF37] font-semibold text-lg">{formatPrice(preview.amount)}</p></div>
                  <div><p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">Status</p><StatusBadge status={preview.status} /></div>
                  <div><p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">Customer</p><p className="text-white">{preview.orders?.full_name}</p></div>
                  <div><p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">UTR</p><p className="font-mono text-xs text-[#B3B3B3]">{preview.utr_number}</p></div>
                </div>
                <div>
                  <p className="text-[10px] text-[#555] uppercase tracking-[0.2em] mb-3">Screenshot</p>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0a0a] border border-[rgba(212,175,55,0.08)]">
                    <Image src={preview.screenshot_url} alt="Payment proof" fill className="object-contain" />
                  </div>
                  <a href={preview.screenshot_url} target="_blank" rel="noreferrer" className="text-xs text-[#D4AF37] hover:text-[#E8CC6A] mt-2 inline-flex items-center gap-1 transition-colors">
                    <ExternalLink className="w-3 h-3" /> Open full size
                  </a>
                </div>
                {preview.status === 'pending' && (
                  <div>
                    <label className="text-[10px] text-[#555] uppercase tracking-[0.2em] block mb-2">Note (optional)</label>
                    <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-[#0c0c0c] border border-[rgba(212,175,55,0.12)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-colors" placeholder="Rejection reason or approval note…" />
                  </div>
                )}
              </div>
              {preview.status === 'pending' && (
                <div className="p-6 border-t border-[rgba(212,175,55,0.08)] flex gap-3">
                  <motion.button onClick={() => handleReview('rejected')} disabled={reviewing} className="flex-1 flex items-center justify-center gap-2 border border-red-500/20 text-red-400 hover:bg-red-500/5 text-sm py-3 rounded-xl transition-colors disabled:opacity-50" whileTap={{ scale: 0.97 }}>
                    <XCircle className="w-4 h-4" /> Reject
                  </motion.button>
                  <motion.button onClick={() => handleReview('approved')} disabled={reviewing} className="flex-1 flex items-center justify-center gap-2 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 text-sm py-3 rounded-xl transition-colors disabled:opacity-50" whileTap={{ scale: 0.97 }}>
                    <CheckCircle className="w-4 h-4" /> Approve
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}