import { useEffect, useCallback, useRef, useState } from 'react'
import { enableIndexedDbPersistence } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { CharacterData } from '@/components/character-context'
import { FirebaseCharacterService, SyncResult } from './firebaseService'

// Enable offline persistence (only runs once)
let persistenceEnabled = false
if (!persistenceEnabled && isFirebaseConfigured && db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence only works in one.')
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ This browser does not support offline persistence.')
    }
  })
  persistenceEnabled = true
}

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
      setSynced(true)
    }

    initialSync()
  }, [userId, synced, onUpdate, onConflict])

  // Listen to real-time changes from Firestore (only if logged in)
  useEffect(() => {
    if (!isFirebaseConfigured || !userId || !synced) return

    const unsubscribe = FirebaseCharacterService.subscribeToCharacter(
      userId,
      (remoteCharacter) => {
        // DO NOT update if there are local changes pending to be saved
        if (pendingChangesRef.current) {
          return
        }

        const remoteData = JSON.stringify(remoteCharacter)
        const localData = lastSavedRef.current

        // Only update if remote data is different
        if (remoteData !== localData) {
          console.log('🔄 Changes detected from another device')
          onUpdate(remoteCharacter)
          FirebaseCharacterService.saveToLocalStorage(remoteCharacter)
          lastSavedRef.current = remoteData
        }
      },
      (error) => {
        console.error('❌ Synchronization error:', error)
      }
    )

    return () => unsubscribe()
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
        FirebaseCharacterService.saveToLocalStorage(character)

        // If logged in and Firebase configured, also save to Firestore
        if (isFirebaseConfigured && userId && synced) {
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
      await FirebaseCharacterService.saveCharacter(userId, character)
      lastSavedRef.current = JSON.stringify(character)
      console.log('💾 Manual save successful')
    } catch (error) {
      console.error('❌ Save error:', error)
    }
  }, [userId, character])

  return { saveToFirestore, synced, isLoggedIn: !!userId }
}
