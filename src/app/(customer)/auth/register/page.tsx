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

const schema = z.object({ full_name: z.string().min(2), email: z.string().email(), password: z.string().min(6) })
type F = z.infer<typeof schema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  async function onSubmit(data: F) {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { full_name: data.full_name } } })
    if (error) { toast.error(error.message); setLoading(false) }
    else { toast.success('Account created! Check your email to confirm.'); router.push('/auth/login') }
  }

  const inp = "input-luxury w-full px-4 py-3.5 text-sm"
  const lbl = "block text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] mb-2"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <SparkleField count={30} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <Logo size="md" className="justify-center mb-8" />
          <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-display)' }}>Create account</h1>
          <p className="text-sm text-[#B3B3B3] mt-2">Join the Divaura family</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map((f) => (
              <div key={f.name}>
                <label className={lbl}>{f.label}</label>
                <input {...register(f.name as keyof F)} type={f.type} className={inp} placeholder={f.placeholder} />
                {errors[f.name as keyof F] && <p className="text-xs text-red-400 mt-1.5">{errors[f.name as keyof F]?.message}</p>}
              </div>
            ))}
            <motion.button type="submit" disabled={loading} className="btn-gold w-full py-4 rounded-[14px] text-sm disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? 'Creating…' : 'Create account'}
            </motion.button>
          </form>
        </div>
        <p className="text-center text-sm text-[#B3B3B3] mt-6">
          Have an account? <Link href="/auth/login" className="text-[#D4AF37] hover:text-[#E8CC6A] transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}