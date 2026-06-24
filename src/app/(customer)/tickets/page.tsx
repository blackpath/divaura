'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, X } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { getTicketsByUser, createTicket } from '@/lib/queries/ticket'
import type { TicketRow } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function TicketsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (!isLoading && !user) router.push('/auth/login') }, [user, isLoading, router])
  useEffect(() => { if (user) getTicketsByUser(user.id).then((d) => { setTickets(d); setLoading(false) }) }, [user])

  async function handleCreate() {
    if (!user || !subject || !message) { toast.error('Please fill all fields'); return }
    setSubmitting(true)
    try {
      const ticket = await createTicket({ userId: user.id, subject, message })
      setTickets([ticket, ...tickets]); setShowModal(false); setSubject(''); setMessage(''); toast.success('Ticket created')
    } catch { toast.error('Failed to create ticket') }
    finally { setSubmitting(false) }
  }

  if (isLoading || !user) return <LoadingSpinner className="py-40" />

  const inp = "input-luxury w-full px-4 py-3 text-sm"

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto pt-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-5xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Support</h1>
            <p className="text-sm text-[#B3B3B3] mt-2">Track your enquiries and requests</p>
          </div>
          <motion.button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 rounded-[14px] text-sm font-medium text-black" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Plus className="w-4 h-4" /> New Ticket
          </motion.button>
        </div>

        {loading ? <LoadingSpinner /> : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full border border-[rgba(212,175,55,0.1)] flex items-center justify-center">
              <MessageSquare className="w-9 h-9 text-[#D4AF37] opacity-30" />
            </div>
            <p className="text-white font-medium">No support tickets</p>
            <p className="text-sm text-[#B3B3B3]">Create a ticket to get help from our concierge team</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/tickets/${t.id}`}>
                  <motion.div className="glass-card p-5 flex items-center justify-between gap-4 cursor-pointer" whileHover={{ x: 4 }}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.subject}</p>
                      <p className="text-xs text-[#555] mt-1">{formatDate(t.created_at)}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-[#111] border border-[rgba(212,175,55,0.15)] rounded-[20px] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[rgba(212,175,55,0.08)]">
                <h2 className="text-lg font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>New Support Ticket</h2>
                <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} placeholder="Briefly describe your issue" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={inp + ' resize-none'} placeholder="Describe your issue in detail…" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-[rgba(212,175,55,0.12)] text-[#B3B3B3] text-sm py-3 rounded-[14px] hover:text-white transition-colors">Cancel</button>
                  <motion.button onClick={handleCreate} disabled={submitting} className="flex-1 text-sm py-3 rounded-[14px] font-medium text-black disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {submitting ? 'Creating…' : 'Create Ticket'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}