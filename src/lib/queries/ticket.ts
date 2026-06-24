import { createClient } from '@/lib/supabase/client'
import type { TicketRow, TicketMessageRow } from '@/lib/supabase/types'

export type TicketWithMessages = TicketRow & { ticket_messages: TicketMessageRow[]; users: { full_name: string | null; email: string } }

export async function createTicket(payload: { userId: string; subject: string; message: string; orderId?: string }): Promise<TicketRow> {
  const supabase = createClient()
  const { data: ticket, error } = await supabase.from('tickets').insert({ user_id: payload.userId, order_id: payload.orderId ?? null, subject: payload.subject, status: 'open' }).select().single()
  if (error) throw error
  await supabase.from('ticket_messages').insert({ ticket_id: ticket.id, sender_id: payload.userId, sender_role: 'customer', message: payload.message })
  return ticket
}

export async function getTicketsByUser(userId: string): Promise<TicketRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('tickets').select('*').eq('user_id', userId).order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getTicketWithMessages(ticketId: string): Promise<TicketWithMessages | null> {
  const supabase = createClient()
  const { data } = await supabase.from('tickets').select('*, ticket_messages(*), users(full_name, email)').eq('id', ticketId).single()
  return data as TicketWithMessages | null
}

export async function getAllTickets(): Promise<TicketWithMessages[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('tickets').select('*, ticket_messages(*), users(full_name, email)').order('updated_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as TicketWithMessages[]
}

export async function sendMessage(payload: { ticketId: string; senderId: string; senderRole: 'customer' | 'admin'; message: string }): Promise<TicketMessageRow> {
  const supabase = createClient()
  const { data, error } = await supabase.from('ticket_messages').insert({ ticket_id: payload.ticketId, sender_id: payload.senderId, sender_role: payload.senderRole, message: payload.message }).select().single()
  if (error) throw error
  await supabase.from('tickets').update({ updated_at: new Date().toISOString() }).eq('id', payload.ticketId)
  return data
}

export async function updateTicketStatus(ticketId: string, status: TicketRow['status']): Promise<void> {
  const supabase = createClient()
  await supabase.from('tickets').update({ status }).eq('id', ticketId)
}