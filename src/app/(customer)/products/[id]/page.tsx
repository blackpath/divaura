'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Shield, ChevronLeft, ChevronRight, Gem } from 'lucide-react'
import { getProductById } from '@/lib/queries/product'
import type { ProductRow } from '@/lib/supabase/types'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<ProductRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    getProductById(id).then((p) => { setProduct(p); setLoading(false) })
  }, [id])

  function handleAddToCart() {
    if (!user) { router.push('/auth/login'); return }
    if (!product) return
    addItem({ id: product.id, product_id: product.id, name: product.name, price: product.price, image_url: product.image_urls?.[0] ?? '', quantity: 1, stock: product.stock })
    setAdded(true)
    toast.success('Added to cart')
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <LoadingSpinner className="py-40" />
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-[#B3B3B3]">This gemstone was not found.</p>
      <Link href="/products" className="text-[#D4AF37] text-sm">← Return to collection</Link>
    </div>
  )

  const specs = [
    { label: 'Category', value: product.category },
    { label: 'Carat Weight', value: product.carat ? `${product.carat} ct` : null },
    { label: 'Cut', value: product.cut },
    { label: 'Colour', value: product.color },
    { label: 'Clarity', value: product.clarity },
    { label: 'Origin', value: product.origin },
    { label: 'Certification', value: product.certification },
  ].filter((s) => s.value)

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto pt-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square glass-card overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  {product.image_urls?.[selectedImg] ? (
                    /* 💎 FIXED INLINE TAG: Standard image element swaps out Next.js domains control */
                    <img 
                      src={product.image_urls[selectedImg]} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center shimmer-gold">
                      <Gem className="w-24 h-24 text-[#D4AF37] opacity-10" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              {product.image_urls && product.image_urls.length > 1 && (
                <>
                  <button onClick={() => setSelectedImg((i) => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-[rgba(212,175,55,0.5)]">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedImg((i) => Math.min(product.image_urls.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-[rgba(212,175,55,0.2)] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:border-[rgba(212,175,55,0.5)]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex gap-2">
                {product.image_urls.map((url, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-[#D4AF37]' : 'border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)]'}`}>
                    {/* 💎 FIXED INLINE TAG: Swapped out for native thumbnail rendering */}
                    <img 
                      src={url} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] mb-4 font-medium">{product.category}</p>
            <h1 className="text-4xl sm:text-5xl font-light text-white mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {product.name}
            </h1>
            <p className="text-4xl text-[#D4AF37] font-light mb-8">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="text-[#B3B3B3] leading-relaxed mb-10 text-sm">{product.description}</p>
            )}

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="glass-card p-6 mb-8 space-y-4">
                {specs.map((spec, i) => (
                  <div key={spec.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B3B3B3]">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                    {i < specs.length - 1 && <div className="divider-gold mt-4" />}
                  </div>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`} />
              <span className="text-xs text-[#B3B3B3]">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {/* CTA */}
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-[14px] text-sm font-semibold tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed ${added ? 'bg-emerald-600 text-white' : 'btn-gold'}`}
              whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
              whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock === 0 ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
            </motion.button>

            <div className="flex items-center gap-2 mt-5 text-xs text-[#555] justify-center">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              Certified authentic — full provenance documentation included
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}