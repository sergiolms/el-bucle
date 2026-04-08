const DB_NAME = "el-bucle"
const DB_VERSION = 2

export const CURRENT_CHARACTER_STORE = "current_character"
export const HISTORY_SNAPSHOTS_STORE = "history_snapshots"

let databasePromise: Promise<IDBDatabase> | null = null

export function openLocalDatabase(): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(CURRENT_CHARACTER_STORE)) {
          database.createObjectStore(CURRENT_CHARACTER_STORE, { keyPath: "id" })
        }

        if (!database.objectStoreNames.contains(HISTORY_SNAPSHOTS_STORE)) {
          const historyStore = database.createObjectStore(HISTORY_SNAPSHOTS_STORE, { keyPath: "id" })
          historyStore.createIndex("by-created-at", "createdAt")
          historyStore.createIndex("by-day", "day")
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"))
    })
  }

  return databasePromise
}

export function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"))
  })
}

export function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"))
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted"))
  })
}

export async function getObjectStore(storeName: string, mode: IDBTransactionMode) {
  const database = await openLocalDatabase()
  const transaction = database.transaction(storeName, mode)
  return {
    store: transaction.objectStore(storeName),
    transaction,
  }
}
