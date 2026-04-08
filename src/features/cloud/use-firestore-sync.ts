import { useCallback, useEffect, useRef, useState } from "react"
import type { CharacterData } from "@/src/features/character/model"
import type { SyncResult } from "./firebase-character-service"
import { isFirebaseConfigured } from "./firebase"
import { saveCharacterToLocalStorage } from "./local-character-storage"

interface UseFirestoreSyncProps {
  userId: string | null
  character: CharacterData
  onUpdate: (data: CharacterData) => void
  onConflict?: (syncResult: SyncResult) => void
}

export function useFirestoreSync({ userId, character, onUpdate, onConflict }: UseFirestoreSyncProps) {
  const [synced, setSynced] = useState(false)
  const lastSavedRef = useRef("")
  const pendingChangesRef = useRef(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !userId || synced) return

    const initialSync = async () => {
      try {
        const { FirebaseCharacterService } = await import("./firebase-character-service")
        await FirebaseCharacterService.enableOfflinePersistence()

        const syncResult = await FirebaseCharacterService.syncWithLocalStorage(userId)
        if (syncResult) {
          console.log("✅ Initial synchronization completed")

          if (syncResult.hasConflict && onConflict) {
            onConflict(syncResult)
          } else {
            onUpdate(syncResult.character)
            lastSavedRef.current = JSON.stringify(syncResult.character)
          }
        }
      } catch (error) {
        console.error("❌ Initial synchronization error:", error)
      }

      setSynced(true)
    }

    void initialSync()
  }, [userId, synced, onUpdate, onConflict])

  useEffect(() => {
    if (!isFirebaseConfigured || !userId || !synced) return

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
              saveCharacterToLocalStorage(remoteCharacter)
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
  }, [userId, synced, onUpdate])

  useEffect(() => {
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
        saveCharacterToLocalStorage(character)

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
  }, [character, userId, synced])

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

  return { saveToFirestore, synced, isLoggedIn: !!userId }
}
