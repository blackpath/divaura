'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayStart?: number
}

export const staggerContainer = (stagger = 0.1, delayStart = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delayStart } },
})

export const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
}

export function StaggerContainer({ children, className, staggerDelay = 0.1, delayStart = 0 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(staggerDelay, delayStart)}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUpItem}>
      {children}
    </motion.div>
  )
}