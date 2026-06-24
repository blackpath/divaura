import { cn } from '@/lib/utils'

interface LogoProps { className?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; showText?: boolean }

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const iconSizes = { xs: 24, sm: 32, md: 40, lg: 56 }
  const textSizes = { xs: 'text-lg', sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' }
  const s = iconSizes[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <svg width={s} height={s} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5D76E" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="gold-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8CC6A" />
            <stop offset="100%" stopColor="#A8892A" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Outer diamond */}
        <polygon points="28,3 51,21 28,53 5,21" fill="none" stroke="url(#gold-grad)" strokeWidth="1.2" />
        {/* Upper left facet */}
        <polygon points="28,3 5,21 16,21" fill="url(#gold-grad)" opacity="0.12" />
        {/* Upper right facet */}
        <polygon points="28,3 51,21 40,21" fill="url(#gold-grad-2)" opacity="0.2" />
        {/* Center belt */}
        <line x1="5" y1="21" x2="51" y2="21" stroke="url(#gold-grad)" strokeWidth="0.8" opacity="0.5" />
        {/* Inner facet lines */}
        <line x1="16" y1="21" x2="28" y2="53" stroke="url(#gold-grad)" strokeWidth="0.6" opacity="0.4" />
        <line x1="40" y1="21" x2="28" y2="53" stroke="url(#gold-grad-2)" strokeWidth="0.6" opacity="0.4" />
        <line x1="28" y1="3" x2="16" y2="21" stroke="url(#gold-grad)" strokeWidth="0.6" opacity="0.6" />
        <line x1="28" y1="3" x2="40" y2="21" stroke="url(#gold-grad-2)" strokeWidth="0.6" opacity="0.6" />
        {/* Hidden D form — the vertical stroke */}
        <path d="M21 15 L21 41 L27 41 C34 41 38 36.5 38 28 C38 19.5 34 15 27 15 Z" fill="none" stroke="url(#gold-grad)" strokeWidth="1.4" strokeLinejoin="round" filter="url(#glow)" />
        {/* Apex sparkle */}
        <circle cx="28" cy="3" r="2" fill="url(#gold-grad)" filter="url(#glow)" />
        {/* Side sparkles */}
        <circle cx="5" cy="21" r="1.2" fill="#D4AF37" opacity="0.7" />
        <circle cx="51" cy="21" r="1.2" fill="#D4AF37" opacity="0.7" />
        {/* Bottom sparkle */}
        <circle cx="28" cy="53" r="1.5" fill="url(#gold-grad)" opacity="0.8" />
      </svg>

      {showText && (
        <span
          className={cn('text-gold-gradient tracking-[0.15em] font-light leading-none', textSizes[size])}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Divaura
        </span>
      )}
    </div>
  )
}