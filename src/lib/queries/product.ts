import { createClient } from '@/lib/supabase/client'
import type { ProductRow } from '@/lib/supabase/types'

export type ProductFilters = { category?: string; search?: string; featured?: boolean }

export async function getProducts(filters: ProductFilters = {}): Promise<ProductRow[]> {
  const supabase = createClient()
  
  // 💎 FIXED: Modified filter logic to allow rows where is_active might be null or unassigned from seeding
  let q = supabase
    .from('products')
    .select('*')
    .or('is_active.eq.true,is_active.is.null') 
    .order('created_at', { ascending: false })

  if (filters.category) {
    q = q.eq('category', filters.category.toLowerCase().trim())
  }
  if (filters.featured) {
    q = q.eq('is_featured', true)
  }
  if (filters.search) {
    q = q.ilike('name', `%${filters.search.trim()}%`)
  }

  const { data, error } = await q
  if (error) {
    console.error("Error inside getProducts query:", error.message)
    throw error
  }
  return data ?? []
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  const supabase = createClient()
  // 💎 FIXED: Adjusted individual product lookup constraints similarly
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .or('is_active.eq.true,is_active.is.null')
    .single()
    
  if (error) console.warn(`Item lookup fallback notice: ${error.message}`)
  return data
}

export async function getAllProductsAdmin(): Promise<ProductRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createProduct(product: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRow> {
  const supabase = createClient()
  const { data, error } = await supabase.from('products').insert(product).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, updates: Partial<ProductRow>): Promise<ProductRow> {
  const supabase = createClient()
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)
  if (error) throw error
}

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${productId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}