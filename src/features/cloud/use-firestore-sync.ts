import { useCallback, useEffect, useRef, useState } from "react"
import type { CharacterData } from "@/src/features/character/model"
import { saveCurrentCharacter } from "@/src/features/persistence"
import type { SyncResult } from "./firebase-character-service"
import { isFirebaseConfigured } from "./firebase"

interface UseFirestoreSyncProps {
  userId: string | null
  character: CharacterData
  onUpdate: (data: CharacterData) => void
  onConflict?: (syncResult: SyncResult) => void
}

export function useFirestoreSync({ userId, character, onUpdate, onConflict }: UseFirestoreSyncProps) {
  const [synced, setSynced] = useState(false)
  const [initialSyncComplete, setInitialSyncComplete] = useState(false)
  const [hasPendingConflict, setHasPendingConflict] = useState(false)
  const lastSavedRef = useRef("")
  const pendingChangesRef = useRef(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!userId) {
      setSynced(false)
      setInitialSyncComplete(false)
      setHasPendingConflict(false)
      lastSavedRef.current = ""
      pendingChangesRef.current = false
      return
    }
  }, [userId])

  useEffect(() => {
    if (!isFirebaseConfigured || !userId || initialSyncComplete) return

    const initialSync = async () => {
      try {
        const { FirebaseCharacterService } = await import("./firebase-character-service")
        await FirebaseCharacterService.enableOfflinePersistence()

        const syncResult = await FirebaseCharacterService.syncWithLocalData(userId)
        if (syncResult) {
          console.log("✅ Initial synchronization completed")

          if (syncResult.hasConflict && onConflict) {
            setHasPendingConflict(true)
            onConflict(syncResult)
          } else {
            onUpdate(syncResult.character)
            lastSavedRef.current = JSON.stringify(syncResult.character)
            setSynced(true)
          }
        } else {
          lastSavedRef.current = JSON.stringify(character)
          setSynced(true)
        }
      } catch (error) {
        console.error("❌ Initial synchronization error:", error)
        lastSavedRef.current = JSON.stringify(character)
        setSynced(true)
      }

      setInitialSyncComplete(true)
    }

    void initialSync()
  }, [character, initialSyncComplete, onConflict, onUpdate, userId])

  useEffect(() => {
    if (!isFirebaseConfigured || !userId || !synced || hasPendingConflict) return

    let active = true
    let unsubscribe = () => {}

    void (async () => {
      try {
        const { FirebaseCharacterService } = await import("./firebase-character-service")

        const nextUnsubscribe = await FirebaseCharacterService.subscribeToCharacter(
          userId,
          (remoteCharacter) => {
            if (pendingChangesRef.current) {
              return
            }

            const remoteData = JSON.stringify(remoteCharacter)
            const localData = lastSavedRef.current

            if (remoteData !== localData) {
              console.log("🔄 Changes detected from another device")
              onUpdate(remoteCharacter)
              void saveCurrentCharacter(remoteCharacter)
              lastSavedRef.current = remoteData
            }
          },
          (error) => {
            console.error("❌ Synchronization error:", error)
          }
        )

        if (!active) {
          nextUnsubscribe()
          return
        }

        unsubscribe = nextUnsubscribe
      } catch (error) {
        console.error("❌ Error starting realtime sync:", error)
      }
    })()

    return () => {
      active = false
      unsubscribe()
    }
  }, [hasPendingConflict, onUpdate, synced, userId])

  useEffect(() => {
    if (hasPendingConflict) {
      pendingChangesRef.current = false
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      return
    }

    const currentData = JSON.stringify(character)

    if (currentData === lastSavedRef.current) {
      pendingChangesRef.current = false
      return
    }

    pendingChangesRef.current = true

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveCurrentCharacter(character)

        if (isFirebaseConfigured && userId && synced) {
          const { FirebaseCharacterService } = await import("./firebase-character-service")
          await FirebaseCharacterService.saveCharacter(userId, character)
          console.log("💾 Saved: localStorage + Firestore")
        } else {
          console.log("💾 Saved: localStorage only")
        }

        lastSavedRef.current = currentData
        pendingChangesRef.current = false
      } catch (error) {
        console.error("❌ Auto-save error:", error)
        pendingChangesRef.current = false
      }
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [character, hasPendingConflict, userId, synced])

  const saveToFirestore = useCallback(async () => {
    if (!userId) return

    try {
      const { FirebaseCharacterService } = await import("./firebase-character-service")
      await FirebaseCharacterService.saveCharacter(userId, character)
      lastSavedRef.current = JSON.stringify(character)
      console.log("💾 Manual save successful")
    } catch (error) {
      console.error("❌ Save error:", error)
    }
  }, [userId, character])

  const resolveConflict = useCallback((resolvedCharacter: CharacterData) => {
    lastSavedRef.current = JSON.stringify(resolvedCharacter)
    pendingChangesRef.current = false
    setHasPendingConflict(false)
    setSynced(true)
  }, [])

  return { saveToFirestore, resolveConflict, synced, isLoggedIn: !!userId }
}
