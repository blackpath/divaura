'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; opacity: number
}

export function SparkleField({ count = 40, className = '' }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function spawn(): Particle {
      return {
        x: Math.random() * (canvas?.width ?? 800),
        y: Math.random() * (canvas?.height ?? 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        life: 0,
        maxLife: 120 + Math.random() * 180,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
      }
    }

    for (let i = 0; i < count; i++) {
      const p = spawn()
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    function drawSparkle(x: number, y: number, size: number, opacity: number) {
      if (!ctx) return
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(x, y)

      // 4-pointed star
      ctx.fillStyle = '#D4AF37'
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4
        const r = i % 2 === 0 ? size * 2 : size * 0.5
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
      }
      ctx.closePath()
      ctx.fill()

      // glow
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4)
      grd.addColorStop(0, `rgba(212,175,55,${opacity * 0.4})`)
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(0, 0, size * 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function frame() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.life++
        p.x += p.vx; p.y += p.vy
        const prog = p.life / p.maxLife
        p.opacity = prog < 0.2 ? prog / 0.2 : prog > 0.8 ? (1 - prog) / 0.2 : 1
        drawSparkle(p.x, p.y, p.size, p.opacity * 0.7)
        if (p.life >= p.maxLife) Object.assign(p, spawn(), { life: 0 })
      }
      animId = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    frame()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}