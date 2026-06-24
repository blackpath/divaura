'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Logo } from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); 
    setLoading(true);

    // 💎 LOCAL DEVELOPER HARDCODE BYPASS
    // Choose any email and password you want to use locally
    if (email === 'admin@divaura.com' && password === 'Admin123!') {
      toast.success('Developer Bypass Authorized!');
      router.push('/admin');
      return;
    }

    // Fallback to your original Supabase auth sequence if you type anything else
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { 
      toast.error('Invalid credentials'); 
      setLoading(false); 
      return; 
    }

    const { data } = await supabase.from('users').select('role').eq('id', (await supabase.auth.getUser()).data.user!.id).single()
    if (data?.role !== 'admin') {
      await supabase.auth.signOut()
      toast.error('Not authorized as admin')
      setLoading(false); 
      return;
    }

    router.push('/admin')
  }

  const inp = "w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[rgba(212,175,55,0.5)] transition-colors"

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Logo size="md" className="justify-center mb-6" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">Admin Access</p>
        </div>
        <div className="bg-[#111] border border-[rgba(212,175,55,0.1)] rounded-[20px] p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] mb-2">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inp} placeholder="admin@divaura.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#B3B3B3] mb-2">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={inp} placeholder="••••••••" />
            </div>
            <motion.button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-xl text-sm font-semibold tracking-wider transition-all disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8CC6A)', color: '#090909' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? 'Signing in…' : 'Enter Dashboard'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}