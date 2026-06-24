'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  isLoading: true, 
  isAdmin: false, 
  signOut: async () => {} 
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  // 💎 FIXED: Returns a boolean promise to guarantee execution synchronization
  async function checkAdminRole(userId?: string): Promise<boolean> {
    if (!userId) return false
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error || !data) return false
      return data.role === 'admin'
    } catch {
      return false
    }
  }

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (isMounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const adminStatus = await checkAdminRole(session.user.id)
            setIsAdmin(adminStatus)
          } else {
            setIsAdmin(false)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeAuth()

    // Handle real-time user auth status changes cleanly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return
      
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      
      if (currentSession?.user) {
        setIsLoading(true) // Keep app guarded while verifying changes
        const adminStatus = await checkAdminRole(currentSession.user.id)
        setIsAdmin(adminStatus)
        setIsLoading(false)
      } else {
        setIsAdmin(false)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)