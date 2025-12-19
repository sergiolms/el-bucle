import { useEffect, useCallback, useRef, useState } from 'react'
import { enableIndexedDbPersistence } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { CharacterData } from '@/components/character-context'
import { FirebaseCharacterService } from './firebaseService'

// Enable offline persistence (solo se ejecuta una vez)
let persistenceEnabled = false
if (!persistenceEnabled && isFirebaseConfigured && db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Múltiples pestañas abiertas, la persistencia solo funciona en una.')
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Este navegador no soporta persistencia offline.')
    }
  })
  persistenceEnabled = true
}

interface UseFirestoreSyncProps {
  userId: string | null
  character: CharacterData
  onUpdate: (data: CharacterData) => void
}

export function useFirestoreSync({ userId, character, onUpdate }: UseFirestoreSyncProps) {
  const [synced, setSynced] = useState(false)
  const lastSavedRef = useRef<string>('')
  const pendingChangesRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar al iniciar sesión (solo una vez)
  useEffect(() => {
    if (!isFirebaseConfigured || !userId || synced) return

    const initialSync = async () => {
      const syncedCharacter = await FirebaseCharacterService.syncWithLocalStorage(userId)
      if (syncedCharacter) {
        console.log('✅ Sincronización inicial completada')
        onUpdate(syncedCharacter)
        lastSavedRef.current = JSON.stringify(syncedCharacter)
      }
      setSynced(true)
    }

    initialSync()
  }, [userId, synced, onUpdate])

  // Escuchar cambios en tiempo real de Firestore (solo si está logueado)
  useEffect(() => {
    if (!isFirebaseConfigured || !userId || !synced) return

    const unsubscribe = FirebaseCharacterService.subscribeToCharacter(
      userId,
      (remoteCharacter) => {
        // NO actualizar si hay cambios locales pendientes de guardar
        if (pendingChangesRef.current) {
          return
        }

        const remoteData = JSON.stringify(remoteCharacter)
        const localData = lastSavedRef.current

        // Solo actualizar si los datos remotos son diferentes
        if (remoteData !== localData) {
          console.log('🔄 Cambios detectados desde otro dispositivo')
          onUpdate(remoteCharacter)
          FirebaseCharacterService.saveToLocalStorage(remoteCharacter)
          lastSavedRef.current = remoteData
        }
      },
      (error) => {
        console.error('❌ Error en sincronización:', error)
      }
    )

    return () => unsubscribe()
  }, [userId, synced, onUpdate])

  // Auto-guardar cambios (con debounce)
  useEffect(() => {
    const currentData = JSON.stringify(character)

    // No guardar si no ha cambiado
    if (currentData === lastSavedRef.current) {
      pendingChangesRef.current = false
      return
    }

    // Marcar que hay cambios pendientes
    pendingChangesRef.current = true

    // Limpiar timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Siempre guardar en localStorage
        FirebaseCharacterService.saveToLocalStorage(character)

        // Si está logueado y Firebase configurado, también guardar en Firestore
        if (isFirebaseConfigured && userId && synced) {
          await FirebaseCharacterService.saveCharacter(userId, character)
          console.log('💾 Guardado: localStorage + Firestore')
        } else {
          console.log('💾 Guardado: solo localStorage')
        }

        lastSavedRef.current = currentData
        pendingChangesRef.current = false // Cambios guardados
      } catch (error) {
        console.error('❌ Error al auto-guardar:', error)
        pendingChangesRef.current = false
      }
    }, 1000) // Debounce 1 segundo

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [character, userId, synced])

  // Función manual para guardar
  const saveToFirestore = useCallback(async () => {
    if (!userId) return

    try {
      await FirebaseCharacterService.saveCharacter(userId, character)
      lastSavedRef.current = JSON.stringify(character)
      console.log('💾 Guardado manual exitoso')
    } catch (error) {
      console.error('❌ Error al guardar:', error)
    }
  }, [userId, character])

  return { saveToFirestore, synced, isLoggedIn: !!userId }
}
