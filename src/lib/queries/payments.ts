import { createClient } from '@/lib/supabase/client'
import type { PaymentProofRow } from '@/lib/supabase/types'

export type PaymentWithOrder = PaymentProofRow & { orders: { id: string; total: number; full_name: string } }

export async function submitPaymentProof(payload: { orderId: string; userId: string; utrNumber: string; amount: number; screenshot: File }): Promise<PaymentProofRow> {
  const supabase = createClient()
  const ext = payload.screenshot.name.split('.').pop()
  const path = `${payload.userId}/${payload.orderId}-${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(path, payload.screenshot)
  if (uploadError) throw uploadError
  const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path)
  const { data, error } = await supabase.from('payment_proofs').insert({ order_id: payload.orderId, user_id: payload.userId, utr_number: payload.utrNumber, screenshot_url: urlData.publicUrl, amount: payload.amount, status: 'pending' }).select().single()
  if (error) throw error
  return data
}

export async function getAllPayments(): Promise<PaymentWithOrder[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('payment_proofs').select('*, orders(id, total, full_name)').order('submitted_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as PaymentWithOrder[]
}

export async function reviewPayment(paymentId: string, status: 'approved' | 'rejected', adminId: string, adminNote?: string): Promise<void> {
  const supabase = createClient()
  const { data: payment } = await supabase.from('payment_proofs').select('order_id').eq('id', paymentId).single()
  await supabase.from('payment_proofs').update({ status, admin_note: adminNote ?? null, reviewed_at: new Date().toISOString(), reviewed_by: adminId }).eq('id', paymentId)
  if (status === 'approved') await supabase.from('orders').update({ payment_status: 'approved', status: 'paid' }).eq('id', payment!.order_id)
  else await supabase.from('orders').update({ payment_status: 'rejected' }).eq('id', payment!.order_id)
}