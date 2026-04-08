import type { CharacterData } from "@/src/features/character/model"
import {
  CURRENT_CHARACTER_STORE,
  getObjectStore,
  waitForTransaction,
  wrapRequest,
} from "./database"
const CURRENT_CHARACTER_KEY = "active-character"
export const LEGACY_STORAGE_MIGRATED_EVENT = "el-bucle:legacy-storage-migrated"
export const LEGACY_MIGRATION_NOTICE_KEY = "el-bucle-legacy-migration-notice"

const LEGACY_CHARACTER_KEY = "el-bucle-character"
const LEGACY_TIMESTAMP_KEY = "el-bucle-character-timestamp"

export interface CharacterRecord {
  id: string
  character: CharacterData
  updatedAt: number
}

let migrationPromise: Promise<void> | null = null

function readLegacyCharacter(): CharacterRecord | null {
  try {
    const localData = localStorage.getItem(LEGACY_CHARACTER_KEY)
    const timestampValue = localStorage.getItem(LEGACY_TIMESTAMP_KEY)

    if (!localData) {
      return null
    }

    return {
      id: CURRENT_CHARACTER_KEY,
      character: JSON.parse(localData) as CharacterData,
      updatedAt: timestampValue ? parseInt(timestampValue, 10) : Date.now(),
    }
  } catch (error) {
    console.error("Error reading legacy localStorage character:", error)
    return null
  }
}

function clearLegacyCharacter(): void {
  try {
    localStorage.removeItem(LEGACY_CHARACTER_KEY)
    localStorage.removeItem(LEGACY_TIMESTAMP_KEY)
  } catch (error) {
    console.error("Error clearing legacy localStorage character:", error)
  }
}

function notifyLegacyMigration() {
  if (typeof window === "undefined") {
    return
  }

  sessionStorage.setItem(LEGACY_MIGRATION_NOTICE_KEY, "1")
  window.dispatchEvent(new CustomEvent(LEGACY_STORAGE_MIGRATED_EVENT))
}

export async function migrateLegacyCharacterStorage(): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  if (!migrationPromise) {
    migrationPromise = (async () => {
      const existingRecord = await getCurrentCharacterRecord(false)
      if (existingRecord) {
        clearLegacyCharacter()
        return
      }

      const legacyRecord = readLegacyCharacter()
      if (!legacyRecord) {
        return
      }

      await saveCurrentCharacterRecord(legacyRecord)
      clearLegacyCharacter()
      notifyLegacyMigration()
    })()
  }

  await migrationPromise
}

export async function getCurrentCharacterRecord(runMigration = true): Promise<CharacterRecord | null> {
  if (runMigration) {
    await migrateLegacyCharacterStorage()
  }

  const { store } = await getObjectStore(CURRENT_CHARACTER_STORE, "readonly")
  const record = await wrapRequest(store.get(CURRENT_CHARACTER_KEY))
  return (record as CharacterRecord | undefined) ?? null
}

export async function loadCurrentCharacter(): Promise<CharacterData | null> {
  const record = await getCurrentCharacterRecord()
  return record?.character ?? null
}

export async function saveCurrentCharacter(character: CharacterData, updatedAt = Date.now()): Promise<CharacterRecord> {
  const record: CharacterRecord = {
    id: CURRENT_CHARACTER_KEY,
    character,
    updatedAt,
  }

  await saveCurrentCharacterRecord(record)
  return record
}

export async function saveCurrentCharacterRecord(record: CharacterRecord): Promise<void> {
  const { store, transaction } = await getObjectStore(CURRENT_CHARACTER_STORE, "readwrite")
  store.put(record)
  await waitForTransaction(transaction)
}
