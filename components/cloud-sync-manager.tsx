import { useCallback, useState } from "react"
import { DataConflictModal } from "./data-conflict-modal"
import { useCharacter } from "./character-context"
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

  const { resolveConflict } = useFirestoreSync({
    userId: user?.uid || null,
    character,
    onUpdate: (data) => {
      replaceCharacter(data)
    },
    onConflict: (syncResult) => {
      setConflictData(syncResult)
    },
  })

  const handleSelectLocal = useCallback(async () => {
    if (!conflictData || !user) return

    if (conflictData.conflictType === "cloud-recovery") {
      await saveCurrentCharacter(character)
      resolveConflict(character)
      setConflictData(null)
      return
    }

    const { FirebaseCharacterService } = await import("@/src/features/cloud/firebase-character-service")

    if (!conflictData.localData) {
      return
    }

    replaceCharacter(conflictData.localData)
    await FirebaseCharacterService.saveCharacter(user.uid, conflictData.localData)
    await saveCurrentCharacter(conflictData.localData)
    resolveConflict(conflictData.localData)

    setConflictData(null)
  }, [character, conflictData, replaceCharacter, resolveConflict, user])

  const handleSelectCloud = useCallback(() => {
    if (!conflictData?.cloudData) return

    replaceCharacter(conflictData.cloudData)
    void saveCurrentCharacter(conflictData.cloudData)
    resolveConflict(conflictData.cloudData)
    setConflictData(null)
  }, [conflictData, replaceCharacter, resolveConflict])

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
