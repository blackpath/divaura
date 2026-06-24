'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SparkleField } from '@/components/effects/SparkleField'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#090909]">
      <SparkleField count={30} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center relative z-10">
        <p className="text-[120px] font-light leading-none text-gold-gradient" style={{ fontFamily: 'var(--font-display)' }}>404</p>
        <p className="text-[#B3B3B3] tracking-[0.3em] text-sm uppercase mt-2 mb-10">This page does not exist</p>
        <Link href="/">
          <motion.div className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-[14px] text-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Return home
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}