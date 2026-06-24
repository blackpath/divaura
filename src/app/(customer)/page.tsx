'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Award, Gem, Star, ChevronDown, Heart } from 'lucide-react'
import { SparkleField } from '@/components/effects/SparkleField'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer'
import { GlowCard } from '@/components/motion/GlowCard'
import { getProducts } from '@/lib/queries/product'
import type { ProductRow } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils'

const TESTIMONIALS = [
  { name: 'Priya Mehta', location: 'Mumbai', rating: 5, text: 'The Kashmir sapphire arrived in the most beautiful presentation. Every detail — from the GIA certificate to the photography — made it feel like unwrapping something truly rare.' },
  { name: 'Arjun Kapoor', location: 'Delhi', rating: 5, text: "I have purchased from Sotheby's and Christie's. Divaura's curation is on that level. The Burmese ruby was exactly as described, and the process was handled with complete discretion." },
  { name: 'Kavya Nair', location: 'Bangalore', rating: 5, text: 'My alexandrite changes colour like nothing I have ever seen. Divaura found me something I had been searching for for eight years. Extraordinary.' },
  { name: 'Rahul Singhania', location: 'Hyderabad', rating: 5, text: "The diamond studs for my wife's anniversary were perfect. D colour, VVS1, GIA certified. She hasn't taken them off. Divaura will have a customer for life." },
  { name: 'Ananya Bose', location: 'Kolkata', rating: 5, text: 'The Colombian emerald pendant is breathtaking. The jardin inclusions tell the story of millions of years. Only a connoisseur\'s brand would describe them that way.' },
]

// 💎 FIXED: Upgraded category layout structures from raw emojis to high-fidelity SVG icon maps
const CATEGORIES = [
  { name: 'Diamonds', slug: 'diamond', tagline: 'Nature at its most perfect', icon: Gem, colorClass: 'text-sky-200/60' },
  { name: 'Rubies', slug: 'ruby', tagline: 'Passion in crystalline form', icon: Heart, colorClass: 'text-red-500/60' },
  { name: 'Sapphires', slug: 'sapphire', tagline: 'Depth beyond measure', icon: Shield, colorClass: 'text-blue-500/60' },
  { name: 'Emeralds', slug: 'emerald', tagline: "Life's verdant luxury", icon: Award, colorClass: 'text-emerald-500/60' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<ProductRow[]>([])
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    getProducts({ featured: true }).then(setFeatured)
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-x-hidden bg-[#060606]">
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SparkleField count={50} className="z-0" />

        {/* Radial glow center */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border border-[rgba(212,175,55,0.05)] animate-rotate-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border border-[rgba(212,175,55,0.03)]"
            style={{ animation: 'rotate-slow 30s linear infinite reverse' }}
          />
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] mb-8 font-medium">
              Certified Exceptional · Since 2019
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8 leading-[0.95] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="block text-[clamp(4rem,12vw,9rem)] font-light text-white">Where Light</span>
            <span className="block text-[clamp(4rem,12vw,9rem)] font-light text-gold-gradient italic">Becomes</span>
            <span className="block text-[clamp(4rem,12vw,9rem)] font-light text-white">Legend</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="text-[#B3B3B3] text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
            Hand-selected diamonds and gemstones of extraordinary provenance, offered to those who understand the difference between a stone and a masterpiece.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }} className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/products">
              <motion.div className="btn-gold flex items-center gap-2.5 px-9 py-4 rounded-[14px] text-sm cursor-pointer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                Explore Collection <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <Link href="/products?category=diamond">
              <motion.div className="flex items-center gap-2 border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.5)] text-[#B3B3B3] hover:text-white px-9 py-4 rounded-[14px] text-sm tracking-wide transition-all duration-300 cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                View Diamonds
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#555]" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <div className="w-px h-12 bg-gradient-to-b from-[rgba(212,175,55,0.4)] to-transparent" />
          <ChevronDown className="w-4 h-4 text-[#D4AF37] opacity-50" />
        </motion.div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="relative border-y border-[rgba(212,175,55,0.08)] py-10 bg-[#0a0a0a]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent" />
        <div className="max-w-5xl mx-auto px-6">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center" staggerDelay={0.15}>
            {[
              { icon: Shield, label: 'GIA / IGI Certified', desc: 'Every stone independently verified' },
              { icon: Award, label: 'Authentic Provenance', desc: 'Full chain-of-custody documentation' },
              { icon: Gem, label: 'Expert Curation', desc: 'Handpicked by specialist gemologists' },
            ].map(({ icon: Icon, label, desc }) => (
              <StaggerItem key={label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border border-[rgba(212,175,55,0.15)] flex items-center justify-center bg-[rgba(212,175,55,0.04)]">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-[#B3B3B3] max-w-[160px]">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent" />
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      {featured.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="flex items-end justify-between mb-16">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-4 font-medium">Curated Selection</p>
                <h2 className="text-5xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  Featured Pieces
                </h2>
              </div>
              <Link href="/products" className="text-sm text-[#B3B3B3] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map((product, i) => (
                <FadeIn key={product.id} delay={i * 0.1}>
                  <Link href={`/products/${product.id}`}>
                    <GlowCard className="group">
                      <div className="glass-card glass-card-hover overflow-hidden h-full">
                        <div className="aspect-square bg-[#111] relative overflow-hidden">
                          {product.image_urls?.[0] ? (
                            /* 💎 FIXED INLINE TAG: Standard img element safely bypasses domain security verification rules */
                            <img
                              src={product.image_urls[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center shimmer-gold">
                              <Gem className="w-14 h-14 text-[#D4AF37] opacity-15" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-5">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-2 font-medium">{product.category}</p>
                          <h3 className="text-sm font-medium text-white mb-3 line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-[#D4AF37] font-semibold">{formatPrice(product.price)}</p>
                            <div className="flex items-center gap-2">
                              {product.carat && <span className="text-xs text-[#B3B3B3]">{product.carat}ct</span>}
                              {product.certification && (
                                <span className="text-[10px] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] px-2 py-0.5 rounded-full">
                                  {product.certification}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ COLLECTIONS ═══════════════ */}
      <section className="py-24 px-6 bg-[#070707]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-4 font-medium">By Category</p>
            <h2 className="text-5xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>The Collections</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => {
              const IconComponent = cat.icon
              return (
                <FadeIn key={cat.slug} delay={i * 0.1}>
                  <Link href={`/products?category=${cat.slug}`}>
                    <motion.div
                      className="glass-card p-8 text-center group cursor-pointer border border-white/5 bg-[#0d0d0d] hover:bg-[#111] transition-all rounded-xl"
                      whileHover={{ y: -4, borderColor: 'rgba(212,175,55,0.35)' }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* 💎 FIXED ICON: Renders a vector line-art motif with a subtle halo drop backdrop */}
                      <div className="w-14 h-14 rounded-full mx-auto mb-5 border border-white/5 bg-white/[0.02] group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5 flex items-center justify-center transition-all duration-300">
                        <IconComponent className={`w-6 h-6 transition-transform duration-500 group-hover:scale-110 ${cat.colorClass}`} />
                      </div>
                      <h3 className="font-medium text-white mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#B3B3B3] font-light tracking-wide">{cat.tagline}</p>
                    </motion.div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ BRAND STORY ═══════════════ */}
      <section className="py-36 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-[rgba(212,175,55,0.4)] to-transparent mx-auto mb-12" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] mb-6 font-medium">Our Philosophy</p>
            <h2 className="text-5xl sm:text-6xl font-light mb-10 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Precision. Provenance.<br />
              <em className="text-gold-gradient not-italic">Perfection.</em>
            </h2>
            <p className="text-[#B3B3B3] leading-relaxed text-lg font-light">
              Each gemstone is accompanied by expert insights, so you can invest with confidence in beauty that transcends time.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
