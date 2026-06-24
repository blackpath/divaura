'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { useAuth } from '@/lib/context/AuthContext'
import { getAllTickets, sendMessage, updateTicketStatus } from '@/lib/queries/ticket'
import type { TicketWithMessages } from '@/lib/queries/ticket'
import type { TicketRow } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const STATUSES: TicketRow['status'][] = ['open', 'in_progress', 'resolved', 'closed']

export default function AdminTicketsPage() {
  const { isAdmin, isLoading } = useAdmin()
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketWithMessages[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<TicketWithMessages | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isAdmin) getAllTickets().then((d) => { setTickets(d); setLoading(false) })
  }, [isAdmin])

  async function handleReply() {
    if (!user || !reply.trim() || !selected) return
    setSending(true)
    try {
      const msg = await sendMessage({ ticketId: selected.id, senderId: user.id, senderRole: 'admin', message: reply.trim() })
      const updated = { ...selected, ticket_messages: [...selected.ticket_messages, msg] }
      setSelected(updated); setTickets((prev) => prev.map((t) => t.id === selected.id ? updated : t)); setReply('')
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  async function handleStatus(ticketId: string, status: TicketRow['status']) {
    await updateTicketStatus(ticketId, status)
    setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status } : t))
    if (selected?.id === ticketId) setSelected((prev) => prev ? { ...prev, status } : null)
    toast.success('Ticket updated')
  }

  if (isLoading || !isAdmin) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Support Tickets</h1>
        <p className="text-sm text-[#B3B3B3] mt-0.5">{tickets.filter((t) => t.status === 'open').length} open</p>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-5 gap-5" style={{ minHeight: '60vh' }}>
          {/* List */}
          <div className="col-span-2 space-y-2">
            {tickets.map((t) => (
              <motion.button key={t.id} onClick={() => setSelected(t)} className={`w-full text-left p-4 rounded-[16px] border transition-all ${selected?.id === t.id ? 'border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.05)]' : 'border-[rgba(212,175,55,0.06)] bg-[#0d0d0d] hover:bg-[#111]'}`} whileHover={{ x: 2 }}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm text-white font-medium line-clamp-1">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-[#555]">{t.users?.full_name ?? t.users?.email}</p>
                <p className="text-xs text-[#444] mt-1">{formatDate(t.updated_at)}</p>
              </motion.button>
            ))}
          </div>

          {/* Thread */}
          <div className="col-span-3 bg-[#0d0d0d] border border-[rgba(212,175,55,0.08)] rounded-[20px] flex flex-col" style={{ minHeight: '400px' }}>
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-sm text-[#555]">Select a ticket</div>
            ) : (
              <>
                <div className="p-5 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{selected.subject}</p>
                    <p className="text-xs text-[#555] mt-0.5">{selected.users?.full_name ?? selected.users?.email}</p>
                  </div>
                  <select value={selected.status} onChange={(e) => handleStatus(selected.id, e.target.value as TicketRow['status'])} className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[rgba(212,175,55,0.4)]">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                  {selected.ticket_messages.map((msg) => {
                    const isAdmin = msg.sender_role === 'admin'
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-[14px] px-4 py-3 ${isAdmin ? 'bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.12)]' : 'bg-[#111]'}`}>
                          {isAdmin && <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] mb-1.5">Admin</p>}
                          {!isAdmin && <p className="text-[9px] text-[#555] uppercase tracking-[0.2em] mb-1.5">{selected.users?.full_name ?? 'Customer'}</p>}
                          <p className="text-sm text-white">{msg.message}</p>
                          <p className="text-[10px] text-[#444] mt-2">{formatDate(msg.created_at)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {selected.status !== 'closed' && (
                  <div className="p-5 border-t border-[rgba(212,175,55,0.08)] flex gap-3">
                    <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply() } }} className="flex-1 bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-colors" placeholder="Type reply…" />
                    <motion.button onClick={handleReply} disabled={sending || !reply.trim()} className="px-4 py-2.5 rounded-xl text-black disabled:opacity-40 transition-all" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileTap={{ scale: 0.95 }}>
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}