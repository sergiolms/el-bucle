import type { CharacterData } from "@/src/features/character/model"

const DB_NAME = "el-bucle"
const DB_VERSION = 1
const CURRENT_CHARACTER_STORE = "current_character"
const CURRENT_CHARACTER_KEY = "active-character"

const LEGACY_CHARACTER_KEY = "el-bucle-character"
const LEGACY_TIMESTAMP_KEY = "el-bucle-character-timestamp"

export interface CharacterRecord {
  id: string
  character: CharacterData
  updatedAt: number
}

let databasePromise: Promise<IDBDatabase> | null = null
let migrationPromise: Promise<void> | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(CURRENT_CHARACTER_STORE)) {
          database.createObjectStore(CURRENT_CHARACTER_STORE, { keyPath: "id" })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"))
    })
  }

  return databasePromise
}

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"))
  })
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"))
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"))
  })
}

async function getStore(mode: IDBTransactionMode) {
  const database = await openDatabase()
  const transaction = database.transaction(CURRENT_CHARACTER_STORE, mode)
  return {
    store: transaction.objectStore(CURRENT_CHARACTER_STORE),
    transaction,
  }
}

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
    })()
  }

  await migrationPromise
}

export async function getCurrentCharacterRecord(runMigration = true): Promise<CharacterRecord | null> {
  if (runMigration) {
    await migrateLegacyCharacterStorage()
  }

  const { store } = await getStore("readonly")
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
  const { store, transaction } = await getStore("readwrite")
  store.put(record)
  await waitForTransaction(transaction)
}
