'use client'
import { useEffect, useRef } from 'react'

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    function handleMouseMove(e: MouseEvent) {
      if (!glow) return
      glow.style.left = `${e.clientX}px`
      glow.style.top = `${e.clientY}px`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-0 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  )
}