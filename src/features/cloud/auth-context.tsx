import type React from "react"
import type { User } from "firebase/auth"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getAuthService, isFirebaseConfigured } from "./firebase"

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
  isFirebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }

    let cancelled = false
    let unsubscribe = () => {}

    void (async () => {
      try {
        const [authModule, auth] = await Promise.all([
          import("firebase/auth"),
          getAuthService(),
        ])

        if (!auth || cancelled) {
          if (!cancelled) {
            setLoading(false)
          }
          return
        }

        unsubscribe = authModule.onAuthStateChanged(auth, (currentUser) => {
          if (cancelled) return
          setUser(currentUser)
          setLoading(false)
        })
      } catch (error) {
        console.error("❌ Error loading auth state:", error)
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      console.warn("⚠️ Firebase no está configurado")
      throw new Error("Firebase not configured")
    }

    try {
      const [authModule, auth] = await Promise.all([
        import("firebase/auth"),
        getAuthService(),
      ])

      if (!auth) {
        throw new Error("Firebase auth unavailable")
      }

      const result = await authModule.signInWithPopup(auth, new authModule.GoogleAuthProvider())
      console.log("✅ Login exitoso:", result.user.displayName || result.user.email)
      return result.user
    } catch (error: any) {
      console.error("❌ Error en login:", error.message)
      throw error
    }
  }

  const signOut = async () => {
    if (!isFirebaseConfigured) {
      console.warn("⚠️ Firebase no está configurado")
      return
    }

    try {
      const [authModule, auth] = await Promise.all([
        import("firebase/auth"),
        getAuthService(),
      ])

      if (!auth) {
        return
      }

      await authModule.signOut(auth)
      console.log("✅ Logout exitoso")
    } catch (error: any) {
      console.error("❌ Error en logout:", error.message)
      throw error
    }
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInWithGoogle,
    signOut,
    isFirebaseConfigured,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
