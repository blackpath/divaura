'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Gem } from 'lucide-react'
import { useCart } from '@/lib/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, total, updateQty, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-24 h-24 rounded-full border border-[rgba(212,175,55,0.1)] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#D4AF37] opacity-30" />
          </div>
          <h2 className="text-3xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Your cart is empty</h2>
          <p className="text-[#B3B3B3] mb-8">Discover our collection of exceptional gemstones</p>
          <Link href="/products">
            <motion.div className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-[14px] text-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Browse Collection <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto pt-16">
        <h1 className="text-5xl font-light text-white mb-14" style={{ fontFamily: 'var(--font-display)' }}>Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product_id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="glass-card p-5 flex gap-5"
                >
                  <div className="w-24 h-24 rounded-xl bg-[#111] flex-shrink-0 overflow-hidden relative">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Gem className="w-8 h-8 text-[#D4AF37] opacity-20" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white line-clamp-1 mb-1">{item.name}</p>
                    <p className="text-sm text-[#D4AF37]">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <motion.button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-8 h-8 rounded-xl border border-[rgba(212,175,55,0.15)] flex items-center justify-center text-[#B3B3B3] hover:text-white hover:border-[rgba(212,175,55,0.4)] transition-all" whileTap={{ scale: 0.9 }}><Minus className="w-3 h-3" /></motion.button>
                      <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                      <motion.button onClick={() => updateQty(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 rounded-xl border border-[rgba(212,175,55,0.15)] flex items-center justify-center text-[#B3B3B3] hover:text-white hover:border-[rgba(212,175,55,0.4)] transition-all disabled:opacity-30" whileTap={{ scale: 0.9 }}><Plus className="w-3 h-3" /></motion.button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <motion.button onClick={() => removeItem(item.product_id)} className="text-[#555] hover:text-red-400 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Trash2 className="w-4 h-4" /></motion.button>
                    <p className="text-sm font-semibold text-white">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-7 sticky top-28">
              <h2 className="text-xl font-light text-white mb-7" style={{ fontFamily: 'var(--font-display)' }}>Order Summary</h2>
              <div className="space-y-4 mb-7">
                <div className="flex justify-between text-sm">
                  <span className="text-[#B3B3B3]">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#B3B3B3]">Shipping & Insurance</span>
                  <span className="text-emerald-400">Complimentary</span>
                </div>
                <div className="divider-gold" />
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#D4AF37] text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <motion.div className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-[14px] text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}