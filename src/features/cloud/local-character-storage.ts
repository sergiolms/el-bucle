import type { CharacterData } from "@/src/features/character/model"

const LOCALSTORAGE_KEY = "el-bucle-character"
const LOCALSTORAGE_TIMESTAMP_KEY = "el-bucle-character-timestamp"

export interface CharacterWithTimestamp {
  character: CharacterData
  timestamp: number
}

export function saveCharacterToLocalStorage(character: CharacterData, timestamp = Date.now()): void {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(character))
    localStorage.setItem(LOCALSTORAGE_TIMESTAMP_KEY, timestamp.toString())
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export function loadCharacterFromLocalStorage(): CharacterWithTimestamp | null {
  try {
    const localData = localStorage.getItem(LOCALSTORAGE_KEY)
    const timestampStr = localStorage.getItem(LOCALSTORAGE_TIMESTAMP_KEY)

    if (!localData) return null

    return {
      character: JSON.parse(localData) as CharacterData,
      timestamp: timestampStr ? parseInt(timestampStr, 10) : 0,
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error)
    return null
  }
}
