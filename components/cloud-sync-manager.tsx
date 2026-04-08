import { useCallback, useState } from "react"
import { DataConflictModal } from "./data-conflict-modal"
import { useCharacter } from "./character-context"
import type { CharacterData } from "@/src/features/character/model"
import { saveCurrentCharacter } from "@/src/features/persistence"
import {
  type SyncResult,
  useAuth,
  useFirestoreSync,
} from "@/src/features/cloud"

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

    const { FirebaseCharacterService } = await import("@/src/features/cloud/firebase-character-service")

    if (conflictData.localData) {
      replaceCharacter(conflictData.localData)
      await FirebaseCharacterService.saveCharacter(user.uid, conflictData.localData)
      await saveCurrentCharacter(conflictData.localData)
    } else {
      await FirebaseCharacterService.saveCharacter(user.uid, character)
      await saveCurrentCharacter(character)
    }

    setConflictData(null)
  }, [character, conflictData, replaceCharacter, user])

  const handleSelectCloud = useCallback(() => {
    if (!conflictData?.cloudData) return

    replaceCharacter(conflictData.cloudData)
    void saveCurrentCharacter(conflictData.cloudData)
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
