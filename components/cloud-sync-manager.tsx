import { useCallback, useState } from "react"
import { DataConflictModal } from "./data-conflict-modal"
import type { CharacterData } from "./character-context"
import { useCharacter } from "./character-context"
import { useAuth } from "@/src/lib/useAuth"
import { useFirestoreSync } from "@/src/lib/useFirestoreSync"
import type { SyncResult } from "@/src/lib/firebaseService"
import { saveCharacterToLocalStorage } from "@/src/lib/localCharacterStorage"

export function CloudSyncManager() {
  const { character, replaceCharacter } = useCharacter()
  const { user } = useAuth()
  const [conflictData, setConflictData] = useState<SyncResult | null>(null)

  const handleFirestoreUpdate = useCallback((data: CharacterData) => {
    replaceCharacter(data)
  }, [replaceCharacter])

  const handleConflict = useCallback((syncResult: SyncResult) => {
    setConflictData(syncResult)
  }, [])

  const handleSelectLocal = useCallback(async () => {
    if (!conflictData || !user) return

    const { FirebaseCharacterService } = await import("@/src/lib/firebaseService")

    if (conflictData.localData) {
      replaceCharacter(conflictData.localData)
      await FirebaseCharacterService.saveCharacter(user.uid, conflictData.localData)
      saveCharacterToLocalStorage(conflictData.localData)
    } else {
      await FirebaseCharacterService.saveCharacter(user.uid, character)
      saveCharacterToLocalStorage(character)
    }

    setConflictData(null)
  }, [character, conflictData, replaceCharacter, user])

  const handleSelectCloud = useCallback(() => {
    if (!conflictData?.cloudData) return

    replaceCharacter(conflictData.cloudData)
    saveCharacterToLocalStorage(conflictData.cloudData)
    setConflictData(null)
  }, [conflictData, replaceCharacter])

  useFirestoreSync({
    userId: user?.uid || null,
    character,
    onUpdate: handleFirestoreUpdate,
    onConflict: handleConflict,
  })

  return (
    <DataConflictModal
      isOpen={!!conflictData}
      conflictType={conflictData?.conflictType}
      localData={conflictData?.localData || null}
      cloudData={conflictData?.cloudData || character}
      localTimestamp={conflictData?.localTimestamp}
      cloudTimestamp={conflictData?.cloudTimestamp}
      changedFields={conflictData?.changedFields}
      onSelectLocal={handleSelectLocal}
      onSelectCloud={handleSelectCloud}
    />
  )
}
