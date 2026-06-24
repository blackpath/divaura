'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from '@/components/shared/Logo'
import { SparkleField } from '@/components/effects/SparkleField'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })
type F = z.infer<typeof schema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  async function onSubmit(data: F) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
    if (error) { toast.error(error.message); setLoading(false) }
    else { router.push('/'); router.refresh() }
  }

  const inp = "input-luxury w-full px-4 py-3.5 text-sm"
  const lbl = "block text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] mb-2"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <SparkleField count={30} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <Logo size="md" className="justify-center mb-8" />
          <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Welcome back</h1>
          <p className="text-sm text-[#B3B3B3] mt-2">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={lbl}>Email</label>
              <input {...register('email')} type="email" className={inp} placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className={lbl}>Password</label>
              <input {...register('password')} type="password" className={inp} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password.message}</p>}
            </div>
            <motion.button type="submit" disabled={loading} className="btn-gold w-full py-4 rounded-[14px] text-sm mt-2 disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          No account?{' '}
          <Link href="/auth/register" className="text-[#D4AF37] hover:text-[#E8CC6A] transition-colors">Create one</Link>
        </p>
      </motion.div>
    </div>
  )
}