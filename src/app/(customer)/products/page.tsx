'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Gem, SlidersHorizontal } from 'lucide-react'
import { getProducts } from '@/lib/queries/product'
import type { ProductRow } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils'
import { SkeletonCard } from '@/components/shared/SkeletonCard'
import { FadeIn } from '@/components/motion/FadeIn'
import { GlowCard } from '@/components/motion/GlowCard'

const CATEGORIES = ['All', 'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Alexandrite', 'Opal', 'Tanzanite']

function ProductsInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const category = searchParams.get('category') ?? ''
  const search = searchParams.get('search') ?? ''

  useEffect(() => {
    setLoading(true)
    getProducts({ category: category || undefined, search: search || undefined })
      .then((data) => { setProducts(data); setLoading(false) })
  }, [category, search])

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value); else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn className="pt-16 pb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-3 font-medium">Our Selection</p>
          <h1 className="text-6xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>
            The Collection
          </h1>
        </FadeIn>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              type="text"
              placeholder="Search…"
              defaultValue={search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="input-luxury w-full pl-11 pr-4 py-3 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-[#555]" />
            {CATEGORIES.map((cat) => {
              const val = cat === 'All' ? '' : cat.toLowerCase()
              const active = category === val || (cat === 'All' && !category)
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter('category', val)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-1.5 text-[11px] tracking-wider uppercase rounded-full border transition-all duration-200 ${
                    active
                      ? 'border-[#D4AF37] text-[#D4AF37] bg-[rgba(212,175,55,0.08)]'
                      : 'border-[rgba(212,175,55,0.12)] text-[#B3B3B3] hover:border-[rgba(212,175,55,0.3)] hover:text-white'
                  }`}
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-20 h-20 rounded-full border border-[rgba(212,175,55,0.1)] flex items-center justify-center">
              <Gem className="w-8 h-8 text-[#D4AF37] opacity-30" />
            </div>
            <p className="text-white font-medium">No gemstones found</p>
            <p className="text-sm text-[#B3B3B3]">Try a different category or search term</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <Link href={`/products/${product.id}`}>
                    <GlowCard className="group h-full">
                      <div className="glass-card glass-card-hover overflow-hidden h-full flex flex-col">
                        
                        {/* Image Container */}
                        <div className="aspect-square bg-[#111] relative overflow-hidden flex-shrink-0">
                          {product.image_urls?.[0] ? (
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center shimmer-gold">
                              <Gem className="w-12 h-12 text-[#D4AF37] opacity-10" />
                            </div>
                          )}
                          {/* Absolute gradient sitting correctly overlaying the image box */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Text Details Container */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-medium">{product.category}</p>
                            <h3 className="text-sm font-medium text-white mb-3 line-clamp-2 leading-snug">{product.name}</h3>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-[#D4AF37] font-semibold">{formatPrice(product.price)}</p>
                            <div className="flex items-center gap-2">
                              {product.carat && <span className="text-xs text-[#B3B3B3]">{product.carat}ct</span>}
                              {product.certification && <span className="text-[10px] border border-[rgba(212,175,55,0.15)] text-[#D4AF37] px-2 py-0.5 rounded-full">{product.certification}</span>}
                            </div>
                          </div>
                        </div>

                      </div>
                    </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>}>
      <ProductsInner />
    </Suspense>
  )
}