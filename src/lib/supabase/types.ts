export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; full_name: string | null; phone: string | null; role: 'customer' | 'admin'; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      products: {
        Row: { id: string; name: string; description: string | null; price: number; stock: number; category: string; image_urls: string[]; carat: number | null; cut: string | null; color: string | null; clarity: string | null; origin: string | null; certification: string | null; is_featured: boolean; is_active: boolean; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      cart_items: {
        Row: { id: string; user_id: string; product_id: string; quantity: number; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      orders: {
        Row: { id: string; user_id: string; full_name: string; phone: string; address_line1: string; address_line2: string | null; city: string; state: string; pincode: string; notes: string | null; subtotal: number; total: number; status: 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled'; payment_status: 'pending' | 'approved' | 'rejected'; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: { id: string; order_id: string; product_id: string | null; product_name: string; product_image: string | null; unit_price: number; quantity: number; subtotal: number; created_at: string }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      payment_proofs: {
        Row: { id: string; order_id: string; user_id: string; utr_number: string; screenshot_url: string; amount: number; status: 'pending' | 'approved' | 'rejected'; admin_note: string | null; submitted_at: string; reviewed_at: string | null; reviewed_by: string | null }
        Insert: Omit<Database['public']['Tables']['payment_proofs']['Row'], 'id' | 'submitted_at'>
        Update: Partial<Database['public']['Tables']['payment_proofs']['Insert']>
      }
      tickets: {
        Row: { id: string; user_id: string; order_id: string | null; subject: string; status: 'open' | 'in_progress' | 'resolved' | 'closed'; created_at: string; updated_at: string }
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>
      }
      ticket_messages: {
        Row: { id: string; ticket_id: string; sender_id: string; sender_role: 'customer' | 'admin'; message: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['ticket_messages']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } }
  }
}

export type UserRow = Database['public']['Tables']['users']['Row']
export type ProductRow = Database['public']['Tables']['products']['Row']
export type CartItemRow = Database['public']['Tables']['cart_items']['Row']
export type OrderRow = Database['public']['Tables']['orders']['Row']
export type OrderItemRow = Database['public']['Tables']['order_items']['Row']
export type PaymentProofRow = Database['public']['Tables']['payment_proofs']['Row']
export type TicketRow = Database['public']['Tables']['tickets']['Row']
export type TicketMessageRow = Database['public']['Tables']['ticket_messages']['Row']