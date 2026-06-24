import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '.dark'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8CC6A',
          dark: '#A8892A',
          muted: 'rgba(212,175,55,0.15)',
        },
        luxury: {
          black: '#090909',
          card: '#151515',
          border: 'rgba(212,175,55,0.15)',
          'border-hover': 'rgba(212,175,55,0.45)',
        },
      },
      borderRadius: {
        '2xl': '20px',
        xl: '14px',
        lg: '14px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #D4AF3740 0%, transparent 70%)',
        'luxury-gradient': 'linear-gradient(180deg, #090909 0%, #0f0f0f 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.1)' },
          '50%': { boxShadow: '0 0 60px rgba(212,175,55,0.3), 0 0 100px rgba(212,175,55,0.1)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config