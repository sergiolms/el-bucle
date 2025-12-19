import { useEffect, useState } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ Login exitoso:', result.user.displayName || result.user.email)
      return result.user
    } catch (error: any) {
      console.error('❌ Error en login:', error.message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      console.log('✅ Logout exitoso')
    } catch (error: any) {
      console.error('❌ Error en logout:', error.message)
      throw error
    }
  }

  return { user, loading, signInWithGoogle, signOut }
}
