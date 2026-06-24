'use client'
import { useAuth } from '@/lib/context/AuthContext'

export function AdminHeader() {
  const { user } = useAuth()
  return (
    <header className="h-14 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between px-6 bg-[#0c0c0c]">
      <p className="text-sm text-[#555]">
        Welcome, <span className="text-white">{user?.email}</span>
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        <span className="text-xs text-[#555]">System online</span>
      </div>
    </header>
  )
}