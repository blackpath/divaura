'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { getTicketWithMessages, sendMessage } from '@/lib/queries/ticket'
import type { TicketWithMessages } from '@/lib/queries/ticket'
import { useAuth } from '@/lib/context/AuthContext'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [ticket, setTicket] = useState<TicketWithMessages | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { getTicketWithMessages(id).then((t) => { setTicket(t); setLoading(false) }) }, [id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [ticket?.ticket_messages])

  async function handleSend() {
    if (!user || !message.trim() || !ticket) return
    setSending(true)
    try {
      const msg = await sendMessage({ ticketId: id, senderId: user.id, senderRole: 'customer', message: message.trim() })
      setTicket({ ...ticket, ticket_messages: [...ticket.ticket_messages, msg] }); setMessage('')
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  if (loading) return <LoadingSpinner className="py-40" />
  if (!ticket) return <div className="py-40 text-center text-[#B3B3B3]">Ticket not found.</div>

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto pt-16 flex flex-col" style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <Link href="/tickets" className="inline-flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All tickets
        </Link>
        <div className="glass-card p-5 mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-white">{ticket.subject}</h1>
            <p className="text-xs text-[#555] mt-0.5">{formatDate(ticket.created_at)}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <div className="flex-1 space-y-4 mb-5 overflow-y-auto">
          {ticket.ticket_messages.map((msg) => {
            const isCustomer = msg.sender_role === 'customer'
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-[14px] px-4 py-3.5 ${isCustomer ? 'bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.12)]' : 'bg-[#111] border border-[rgba(255,255,255,0.04)]'}`}>
                  {!isCustomer && <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Divaura Support</p>}
                  <p className="text-sm text-white">{msg.message}</p>
                  <p className="text-[10px] text-[#444] mt-2">{formatDate(msg.created_at)}</p>
                </div>
              </motion.div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {ticket.status !== 'closed' && (
          <div className="flex gap-3">
            <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} className="input-luxury flex-1 px-4 py-3 text-sm" placeholder="Type your message…" />
            <motion.button onClick={handleSend} disabled={sending || !message.trim()} className="px-5 py-3 rounded-xl text-black disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileTap={{ scale: 0.95 }}>
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}