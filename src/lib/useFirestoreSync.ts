import { useEffect, useCallback, useRef, useState } from 'react'
import type { CharacterData } from '@/components/character-context'
import type { SyncResult } from './firebaseService'
import { isFirebaseConfigured } from './firebase'
import { saveCharacterToLocalStorage } from './localCharacterStorage'

interface UseFirestoreSyncProps {
  userId: string | null
  character: CharacterData
  onUpdate: (data: CharacterData) => void
  onConflict?: (syncResult: SyncResult) => void
}

export function useFirestoreSync({ userId, character, onUpdate, onConflict }: UseFirestoreSyncProps) {
  const [synced, setSynced] = useState(false)
  const lastSavedRef = useRef<string>('')
  const pendingChangesRef = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Synchronize on login (only once)
  useEffect(() => {
    if (!isFirebaseConfigured || !userId || synced) return

    const initialSync = async () => {
      try {
        const { FirebaseCharacterService } = await import('./firebaseService')
        await FirebaseCharacterService.enableOfflinePersistence()

        const syncResult = await FirebaseCharacterService.syncWithLocalStorage(userId)
        if (syncResult) {
          console.log('✅ Initial synchronization completed')

          if (syncResult.hasConflict && onConflict) {
            onConflict(syncResult)
          } else {
            onUpdate(syncResult.character)
            lastSavedRef.current = JSON.stringify(syncResult.character)
          }
        }
      } catch (error) {
        console.error('❌ Initial synchronization error:', error)
      }

      setSynced(true)
    }

    initialSync()
  }, [userId, synced, onUpdate, onConflict])

  // Listen to real-time changes from Firestore (only if logged in)
  useEffect(() => {
    if (!isFirebaseConfigured || !userId || !synced) return

    let active = true
    let unsubscribe = () => {}

    void (async () => {
      try {
        const { FirebaseCharacterService } = await import('./firebaseService')

        const nextUnsubscribe = await FirebaseCharacterService.subscribeToCharacter(
          userId,
          (remoteCharacter) => {
            if (pendingChangesRef.current) {
              return
            }

            const remoteData = JSON.stringify(remoteCharacter)
            const localData = lastSavedRef.current

            if (remoteData !== localData) {
              console.log('🔄 Changes detected from another device')
              onUpdate(remoteCharacter)
              saveCharacterToLocalStorage(remoteCharacter)
              lastSavedRef.current = remoteData
            }
          },
          (error) => {
            console.error('❌ Synchronization error:', error)
          }
        )

        if (!active) {
          nextUnsubscribe()
          return
        }

        unsubscribe = nextUnsubscribe
      } catch (error) {
        console.error('❌ Error starting realtime sync:', error)
      }
    })()

    return () => {
      active = false
      unsubscribe()
    }
  }, [userId, synced, onUpdate])

  // Auto-save on character changes (debounced)
  useEffect(() => {
    const currentData = JSON.stringify(character)

    // Do not save if it hasn't changed
    if (currentData === lastSavedRef.current) {
      pendingChangesRef.current = false
      return
    }

    // Mark that there are pending changes
    pendingChangesRef.current = true

    // Clear previous timeout if exists
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Always save to localStorage
        saveCharacterToLocalStorage(character)

        // If logged in and Firebase configured, also save to Firestore
        if (isFirebaseConfigured && userId && synced) {
          const { FirebaseCharacterService } = await import('./firebaseService')
          await FirebaseCharacterService.saveCharacter(userId, character)
          console.log('💾 Saved: localStorage + Firestore')
        } else {
          console.log('💾 Saved: localStorage only')
        }

        lastSavedRef.current = currentData
        pendingChangesRef.current = false // Changes saved
      } catch (error) {
        console.error('❌ Auto-save error:', error)
        pendingChangesRef.current = false
      }
    }, 1000) // Debounce 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [character, userId, synced])

  // Manual save function
  const saveToFirestore = useCallback(async () => {
    if (!userId) return

    try {
      const { FirebaseCharacterService } = await import('./firebaseService')
      await FirebaseCharacterService.saveCharacter(userId, character)
      lastSavedRef.current = JSON.stringify(character)
      console.log('💾 Manual save successful')
    } catch (error) {
      console.error('❌ Save error:', error)
    }
  }, [userId, character])

  return { saveToFirestore, synced, isLoggedIn: !!userId }
}
