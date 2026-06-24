import { createClient } from '@/lib/supabase/client'
import type { OrderRow, OrderItemRow } from '@/lib/supabase/types'
import type { CheckoutFormData } from '@/lib/validations'
import type { CartItem } from '@/lib/context/CartContext'

export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] }

export async function createOrder(userId: string, formData: CheckoutFormData, cartItems: CartItem[]): Promise<OrderRow> {
  const supabase = createClient()
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: userId, ...formData, subtotal, total: subtotal, status: 'pending', payment_status: 'pending',
  }).select().single()
  if (orderError) throw orderError
  const { error: itemsError } = await supabase.from('order_items').insert(
    cartItems.map((item) => ({ order_id: order.id, product_id: item.product_id, product_name: item.name, product_image: item.image_url || null, unit_price: item.price, quantity: item.quantity, subtotal: item.price * item.quantity }))
  )
  if (itemsError) throw itemsError
  return order
}

export async function getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}

export async function updateOrderStatus(orderId: string, status: OrderRow['status']): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) throw error
}

export async function getAdminStats() {
  const supabase = createClient()
  const [products, orders, pendingPayments, openTickets] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('id, total, status', { count: 'exact' }),
    supabase.from('payment_proofs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
  ])
  const revenue = (orders.data ?? []).filter((o) => ['paid','packed','shipped','delivered'].includes(o.status)).reduce((s, o) => s + o.total, 0)
  return { totalProducts: products.count ?? 0, totalOrders: orders.count ?? 0, pendingPayments: pendingPayments.count ?? 0, openTickets: openTickets.count ?? 0, revenue }
}