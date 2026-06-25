'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Upload, X, Gem } from 'lucide-react'
import { useAdmin } from '@/lib/hooks/useAdmin'
import { getAllProductsAdmin, createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/lib/queries/product'
import type { ProductRow } from '@/lib/supabase/types'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

type F = { name: string; description: string; price: string; stock: string; category: string; carat: string; cut: string; color: string; clarity: string; origin: string; certification: string; is_featured: boolean }
const EF: F = { name: '', description: '', price: '', stock: '', category: 'diamond', carat: '', cut: '', color: '', clarity: '', origin: '', certification: '', is_featured: false }

export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAdmin()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ProductRow | null>(null)
  const [form, setForm] = useState<F>(EF)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdmin) getAllProductsAdmin().then((d) => { setProducts(d); setLoading(false) })
  }, [isAdmin])

  function openEdit(p: ProductRow) {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', price: String(p.price), stock: String(p.stock), category: p.category, carat: p.carat ? String(p.carat) : '', cut: p.cut ?? '', color: p.color ?? '', clarity: p.clarity ?? '', origin: p.origin ?? '', certification: p.certification ?? '', is_featured: p.is_featured })
    setImageFile(null); setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = { name: form.name, description: form.description || null, price: parseFloat(form.price), stock: parseInt(form.stock), category: form.category, carat: form.carat ? parseFloat(form.carat) : null, cut: form.cut || null, color: form.color || null, clarity: form.clarity || null, origin: form.origin || null, certification: form.certification || null, is_featured: form.is_featured, is_active: true, image_urls: editing?.image_urls ?? [] }
      let saved = editing ? await updateProduct(editing.id, payload) : await createProduct(payload)
      if (imageFile) {
        const url = await uploadProductImage(imageFile, saved.id)
        saved = await updateProduct(saved.id, { image_urls: [url, ...saved.image_urls] })
      }
      setProducts((prev) => editing ? prev.map((p) => p.id === saved.id ? saved : p) : [saved, ...prev])
      setShowForm(false); toast.success(editing ? 'Product updated' : 'Product created')
    } catch { toast.error('Failed to save product') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Archive this product?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Product archived')
  }

  if (isLoading || !isAdmin) return <LoadingSpinner />

  const inp = "w-full bg-[#0c0c0c] border border-[rgba(212,175,55,0.12)] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-colors"

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Products</h1>
          <p className="text-sm text-[#B3B3B3] mt-0.5">{products.length} items in catalogue</p>
        </div>
        <motion.button onClick={() => { setEditing(null); setForm(EF); setImageFile(null); setShowForm(true) }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-black" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Plus className="w-4 h-4" /> Add Product
        </motion.button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-[#0d0d0d] border border-[rgba(212,175,55,0.08)] rounded-[20px] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(212,175,55,0.08)]">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', '', ''].map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#555] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,55,0.04)]">
              {products.map((p) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/1 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#111] flex-shrink-0 overflow-hidden relative">
                        {p.image_urls?.[0] ? <Image src={p.image_urls[0]} alt={p.name} fill className="object-cover" /> : <Gem className="w-5 h-5 text-[#D4AF37] opacity-20 m-3" />}
                      </div>
                      <span className="font-medium text-white line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#B3B3B3] capitalize">{p.category}</td>
                  <td className="px-5 py-4 text-[#D4AF37] font-medium">{formatPrice(p.price)}</td>
                  <td className="px-5 py-4 text-[#B3B3B3]">{p.stock}</td>
                  <td className="px-5 py-4">{p.is_featured && <StatusBadge status="approved" />}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="p-2 text-[#555] hover:text-white transition-colors rounded-lg hover:bg-white/5"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-[#555] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-start justify-center p-6 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#111] border border-[rgba(212,175,55,0.15)] rounded-[20px] w-full max-w-lg my-8">
              <div className="flex items-center justify-between p-6 border-b border-[rgba(212,175,55,0.08)]">
                <h2 className="text-lg font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>{editing ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="text-[#555] hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Product name" />
                  </div>
                  {[{ key: 'price', label: 'Price (₹)', type: 'number' }, { key: 'stock', label: 'Stock', type: 'number' }].map((f) => (
                    <div key={f.key}>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">{f.label} *</label>
                      <input value={form[f.key as keyof F] as string} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inp} type={f.type} />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
                      {['diamond', 'ruby', 'sapphire', 'emerald', 'alexandrite', 'opal', 'tanzanite', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Carat</label>
                    <input value={form.carat} onChange={(e) => setForm({ ...form, carat: e.target.value })} className={inp} type="number" step="0.01" placeholder="0.00" />
                  </div>
                  {['cut', 'color', 'clarity', 'origin', 'certification'].map((k) => (
                    <div key={k}>
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2 capitalize">{k}</label>
                      <input value={form[k as keyof F] as string} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={inp} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inp + ' resize-none'} />
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="feat" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#D4AF37] w-4 h-4" />
                    <label htmlFor="feat" className="text-sm text-[#B3B3B3]">Feature on home page</label>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] block mb-2">Image</label>
                    <label className="flex items-center gap-3 border border-dashed border-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)] rounded-xl px-4 py-4 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#D4AF37] opacity-60" />
                      <span className="text-sm text-[#B3B3B3]">{imageFile ? imageFile.name : 'Upload image'}</span>
                      <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[rgba(212,175,55,0.08)] flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-[rgba(212,175,55,0.12)] text-[#B3B3B3] text-sm py-3 rounded-xl hover:text-white transition-colors">Cancel</button>
                <motion.button onClick={handleSave} disabled={saving} className="flex-1 text-sm py-3 rounded-xl font-medium text-black disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}