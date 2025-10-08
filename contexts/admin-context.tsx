//contexts\admin-context.tsx

"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase-client"
import { Session } from "@supabase/supabase-js"

interface AdminContextType {
  isAdmin: boolean
  session: Session | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setSession(data.session)
        setIsAdmin(true) // optionally, you can check user roles here
      }
    }

    getSession()

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsAdmin(!!session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message)
      return false
    }

    setSession(data.session)
    setIsAdmin(true)
    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, session, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
