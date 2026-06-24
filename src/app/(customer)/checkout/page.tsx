'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/context/AuthContext'
import { createOrder } from '@/lib/queries/orders'
import { submitPaymentProof } from '@/lib/queries/payments'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import { Upload, Copy, CheckCircle, Check } from 'lucide-react'

type Step = 'address' | 'payment' | 'confirmed'

const UPI_ID = 'divaura@upi'
const UPI_NAME = 'Divaura Gems Private Limited'

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address')
  const [orderId, setOrderId] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) })

  async function onAddressSubmit(data: CheckoutFormData) {
    if (!user) { router.push('/auth/login'); return }
    setSubmitting(true)
    try {
      const order = await createOrder(user.id, data, items)
      setOrderId(order.id); setOrderTotal(order.total); setStep('payment')
    } catch { toast.error('Failed to create order. Please try again.') }
    finally { setSubmitting(false) }
  }

  async function onPaymentSubmit() {
    if (!user || !screenshot || !utr.trim()) { toast.error('Please complete all payment fields'); return }
    setSubmitting(true)
    try {
      await submitPaymentProof({ orderId, userId: user.id, utrNumber: utr, amount: orderTotal, screenshot })
      clearCart(); setStep('confirmed')
    } catch { toast.error('Failed to submit payment proof') }
    finally { setSubmitting(false) }
  }

  function copyUpi() {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const inp = "input-luxury w-full px-4 py-3 text-sm"
  const lbl = "block text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] mb-2"
  const err = "text-xs text-red-400 mt-1.5"

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-light text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Order Confirmed</h1>
          <p className="text-[#B3B3B3] text-sm mb-3">Your payment proof has been submitted for verification.</p>
          <p className="text-xs text-[#555] mb-2">Order ID: <span className="text-[#D4AF37] font-mono">{orderId.slice(0, 8).toUpperCase()}</span></p>
          <p className="text-xs text-[#B3B3B3] mb-10">Our team will verify your payment within 2 hours and update your order status.</p>
          <Link href="/account">
            <motion.div className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-[14px] text-sm" whileHover={{ scale: 1.03 }}>
              View My Orders
            </motion.div>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto pt-16">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-14">
          {(['address', 'payment'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`flex items-center gap-2.5`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                  step === s ? 'border-[#D4AF37] bg-[#D4AF37] text-black' :
                  step === 'payment' && s === 'address' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                  'border-[rgba(212,175,55,0.15)] text-[#555]'
                }`}>
                  {step === 'payment' && s === 'address' ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm capitalize ${step === s ? 'text-white' : 'text-[#555]'}`}>{s}</span>
              </div>
              {i === 0 && <div className="w-16 h-px bg-[rgba(212,175,55,0.1)]" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'address' && (
            <motion.form
              key="address"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onSubmit={handleSubmit(onAddressSubmit)}
              className="space-y-5"
            >
              <h1 className="text-4xl font-light text-white mb-10" style={{ fontFamily: 'var(--font-display)' }}>Delivery Details</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={lbl}>Full Name</label>
                  <input {...register('full_name')} className={inp} placeholder="As on government ID" />
                  {errors.full_name && <p className={err}>{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className={lbl}>Phone Number</label>
                  <input {...register('phone')} className={inp} placeholder="10-digit mobile" />
                  {errors.phone && <p className={err}>{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={lbl}>Pincode</label>
                  <input {...register('pincode')} className={inp} placeholder="6-digit pincode" />
                  {errors.pincode && <p className={err}>{errors.pincode.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Address</label>
                  <input {...register('address_line1')} className={inp} placeholder="House / Flat / Block number" />
                  {errors.address_line1 && <p className={err}>{errors.address_line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Address Line 2 (optional)</label>
                  <input {...register('address_line2')} className={inp} placeholder="Street / Area / Landmark" />
                </div>
                <div>
                  <label className={lbl}>City</label>
                  <input {...register('city')} className={inp} placeholder="City" />
                  {errors.city && <p className={err}>{errors.city.message}</p>}
                </div>
                <div>
                  <label className={lbl}>State</label>
                  <input {...register('state')} className={inp} placeholder="State" />
                  {errors.state && <p className={err}>{errors.state.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={lbl}>Delivery Notes (optional)</label>
                  <textarea {...register('notes')} rows={2} className={inp + ' resize-none'} placeholder="Special instructions…" />
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card p-5 flex justify-between items-center">
                <span className="text-sm text-[#B3B3B3]">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                <span className="text-[#D4AF37] font-semibold">{formatPrice(total)}</span>
              </div>

              <motion.button type="submit" disabled={submitting} className="btn-gold w-full py-4 rounded-[14px] text-sm disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {submitting ? 'Creating order…' : 'Continue to Payment →'}
              </motion.button>
            </motion.form>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-light text-white mb-10" style={{ fontFamily: 'var(--font-display)' }}>Complete Payment</h1>

              {/* UPI Panel */}
              <div className="glass-card p-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#B3B3B3] mb-3">Amount Due</p>
                <p className="text-5xl font-light text-[#D4AF37] mb-8" style={{ fontFamily: 'var(--font-display)' }}>{formatPrice(orderTotal)}</p>

                {/* QR code visual */}
                <div className="w-44 h-44 mx-auto bg-white rounded-2xl flex flex-col items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                  <p className="text-black text-sm font-bold mb-1">UPI QR</p>
                  <p className="text-black text-xs font-mono">{UPI_ID}</p>
                  <div className="mt-2 grid grid-cols-5 gap-0.5">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#B3B3B3] mb-2">Pay via UPI to</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-[#D4AF37] font-mono text-lg">{UPI_ID}</code>
                  <motion.button onClick={copyUpi} whileTap={{ scale: 0.9 }} className="text-[#555] hover:text-[#D4AF37] transition-colors">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
                <p className="text-xs text-[#555] mt-1">{UPI_NAME}</p>
              </div>

              {/* UTR + Screenshot */}
              <div className="space-y-4">
                <div>
                  <label className={lbl}>UTR / Transaction Reference Number</label>
                  <input value={utr} onChange={(e) => setUtr(e.target.value)} className={inp} placeholder="12-digit UTR number from your payment app" />
                </div>
                <div>
                  <label className={lbl}>Payment Screenshot</label>
                  <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)] rounded-[14px] p-8 cursor-pointer transition-colors">
                    <Upload className="w-7 h-7 text-[#D4AF37] opacity-50" />
                    <span className="text-sm text-[#B3B3B3]">{screenshot ? screenshot.name : 'Upload payment screenshot'}</span>
                    <span className="text-xs text-[#555]">PNG, JPG up to 10MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>

              <motion.button onClick={onPaymentSubmit} disabled={submitting || !utr.trim() || !screenshot} className="btn-gold w-full py-4 rounded-[14px] text-sm disabled:opacity-40" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {submitting ? 'Submitting…' : 'Submit Payment Proof'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

import Link from 'next/link'