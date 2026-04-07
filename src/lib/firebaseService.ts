import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { CharacterData } from '@/components/character-context'

const CHARACTERS_COLLECTION = 'characters'
const LOCALSTORAGE_KEY = 'el-bucle-character'
const LOCALSTORAGE_TIMESTAMP_KEY = 'el-bucle-character-timestamp'

export interface CharacterDocument extends CharacterData {
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CharacterWithTimestamp {
  character: CharacterData
  timestamp: number
}

export interface SyncResult {
  character: CharacterData
  hasConflict: boolean
  conflictType?: 'cloud-recovery' | 'data-mismatch'
  localData?: CharacterData
  cloudData?: CharacterData
  localTimestamp?: number
  cloudTimestamp?: string
  changedFields?: string[]
}

/**
 * Service to handle all Firestore operations related to characters
 */
export class FirebaseCharacterService {
  /**
   * Gets a character document from Firestore
   */
  static async getCharacter(userId: string): Promise<CharacterData | null> {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured')
      return null
    }

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as CharacterDocument
        // Remove internal fields before returning
        const { userId: _, createdAt: __, updatedAt: ___, ...characterData } = data
        return characterData
      }

      return null
    } catch (error) {
      console.error('Error getting character from Firestore:', error)
      return null
    }
  }

  /**
   * Saves or updates a character in Firestore
   */
  static async saveCharacter(userId: string, character: CharacterData): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured')
      return
    }

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      const characterDoc: CharacterDocument = {
        ...character,
        userId,
        createdAt: docSnap.exists() ? (docSnap.data() as CharacterDocument).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(docRef, characterDoc)
    } catch (error) {
      console.error('Error saving character to Firestore:', error)
      throw error
    }
  }

  /**
   * Updates specific fields of a character in Firestore
   */
  static async updateCharacter(userId: string, updates: Partial<CharacterData>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured')
      return
    }

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating character in Firestore:', error)
      throw error
    }
  }

  /**
   * Deletes a character from Firestore
   */
  static async deleteCharacter(userId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured')
      return
    }

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting character from Firestore:', error)
      throw error
    }
  }

  /**
   * Listens to real-time changes of a character
   */
  static subscribeToCharacter(
    userId: string,
    onUpdate: (character: CharacterData) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured')
      return () => {} // Return empty unsubscribe function
    }

    const docRef = doc(db, CHARACTERS_COLLECTION, userId)

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CharacterDocument
          const { userId: _, createdAt: __, updatedAt: ___, ...characterData } = data
          onUpdate(characterData)
        }
      },
      (error) => {
        console.error('Error listening to character changes:', error)
        if (onError) onError(error)
      }
    )
  }

  /**
   * Migrates data from localStorage to Firestore
   * Runs only once when the user authenticates for the first time
   */
  static async migrateFromLocalStorage(userId: string): Promise<boolean> {
    try {
      // Check if character already exists in Firestore
      const existingCharacter = await this.getCharacter(userId)
      if (existingCharacter) {
        // Already exists in Firestore, don't migrate
        return false
      }

      // Try to load from localStorage
      const localData = localStorage.getItem(LOCALSTORAGE_KEY)
      if (!localData) {
        // No data in localStorage
        return false
      }

      const characterData = JSON.parse(localData) as CharacterData

      // Save to Firestore
      await this.saveCharacter(userId, characterData)

      console.log('✅ Data migrated from localStorage to Firestore successfully')
      return true
    } catch (error) {
      console.error('Error migrating from localStorage to Firestore:', error)
      return false
    }
  }

  /**
   * Saves to localStorage with timestamp
   */
  static saveToLocalStorage(character: CharacterData, timestamp?: number): void {
    try {
      const now = timestamp || Date.now()
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(character))
      localStorage.setItem(LOCALSTORAGE_TIMESTAMP_KEY, now.toString())
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  /**
   * Loads data from localStorage with timestamp
   */
  static loadFromLocalStorage(): CharacterWithTimestamp | null {
    try {
      const localData = localStorage.getItem(LOCALSTORAGE_KEY)
      const timestampStr = localStorage.getItem(LOCALSTORAGE_TIMESTAMP_KEY)

      if (!localData) return null

      const character = JSON.parse(localData) as CharacterData
      const timestamp = timestampStr ? parseInt(timestampStr, 10) : 0

      return { character, timestamp }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }

  /**
   * Gets a character from Firestore including the updatedAt timestamp
   */
  static async getCharacterWithTimestamp(userId: string): Promise<{
    character: CharacterData
    updatedAt: string | null
  } | null> {
    if (!isFirebaseConfigured || !db) return null

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as CharacterDocument
        const { userId: _, createdAt: __, updatedAt, ...characterData } = data
        return { character: characterData, updatedAt: updatedAt || null }
      }
      return null
    } catch (error) {
      console.error('Error getting character from Firestore:', error)
      return null
    }
  }

  /**
   * Stringifies an array of objects with `id`, sorting by id and
   * sorting each object's keys to produce a stable string regardless
   * of property order (e.g. from Firestore roundtrips).
   */
  private static stableArrayStringify(items: { id: string }[]): string {
    const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id))
    return JSON.stringify(sorted.map(item =>
      Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
    ))
  }

  /**
   * Compares two CharacterData objects field by field.
   * Returns whether they are equal and which fields differ.
   */
  static compareCharacterData(
    a: CharacterData,
    b: CharacterData
  ): { isEqual: boolean; changedFields: string[] } {
    const changedFields: string[] = []

    if (a.body !== b.body) changedFields.push('body')
    if (a.mind !== b.mind) changedFields.push('mind')
    if (a.gesta !== b.gesta) changedFields.push('gesta')
    if (a.status !== b.status) changedFields.push('status')
    if (a.credits !== b.credits) changedFields.push('credits')
    if (a.day !== b.day) changedFields.push('day')
    if (a.hour !== b.hour) changedFields.push('hour')
    if (a.selectedWeaponId !== b.selectedWeaponId) changedFields.push('selectedWeaponId')
    if (a.lastPlayerRoll !== b.lastPlayerRoll) changedFields.push('lastPlayerRoll')
    if (a.useElementalDamage !== b.useElementalDamage) changedFields.push('useElementalDamage')
    if (a.currentSection !== b.currentSection) changedFields.push('currentSection')

    if (this.stableArrayStringify(a.items) !== this.stableArrayStringify(b.items)) changedFields.push('items')
    if (this.stableArrayStringify(a.weapons) !== this.stableArrayStringify(b.weapons)) changedFields.push('weapons')
    if (this.stableArrayStringify(a.clues) !== this.stableArrayStringify(b.clues)) changedFields.push('clues')
    if (this.stableArrayStringify(a.notes) !== this.stableArrayStringify(b.notes)) changedFields.push('notes')
    if (this.stableArrayStringify(a.enemies) !== this.stableArrayStringify(b.enemies)) changedFields.push('enemies')

    return {
      isEqual: changedFields.length === 0,
      changedFields
    }
  }

  /**
   * Synchronizes data between localStorage and Firestore
   * Detects conflicts by comparing actual data content (not timestamps)
   */
  static async syncWithLocalStorage(userId: string): Promise<SyncResult | null> {
    try {
      const localData = this.loadFromLocalStorage()
      const firestoreResult = await this.getCharacterWithTimestamp(userId)

      // Case 1: No data in either source
      if (!localData && !firestoreResult) {
        console.log('📭 No data to synchronize')
        return null
      }

      // Case 2: No local data, cloud exists → Inform user
      if (!localData && firestoreResult) {
        console.log('📥 Cloud data found but no local data - asking user')
        return {
          character: firestoreResult.character,
          hasConflict: true,
          conflictType: 'cloud-recovery',
          cloudData: firestoreResult.character,
          cloudTimestamp: firestoreResult.updatedAt || undefined,
          changedFields: []
        }
      }

      // Case 3: Local data exists, no cloud → Upload silently
      if (localData && !firestoreResult) {
        console.log('📤 Uploading local data to Firestore (first sync)')
        await this.saveCharacter(userId, localData.character)
        return {
          character: localData.character,
          hasConflict: false
        }
      }

      // Case 4: Both exist → Compare actual data content
      if (localData && firestoreResult) {
        const { isEqual, changedFields } = this.compareCharacterData(
          localData.character,
          firestoreResult.character
        )

        if (isEqual) {
          console.log('✅ Local and cloud data are identical')
          this.saveToLocalStorage(firestoreResult.character, Date.now())
          return {
            character: firestoreResult.character,
            hasConflict: false
          }
        }

        console.log('⚠️ CONFLICT: Data content differs in fields:', changedFields)
        return {
          character: firestoreResult.character,
          hasConflict: true,
          conflictType: 'data-mismatch',
          localData: localData.character,
          cloudData: firestoreResult.character,
          localTimestamp: localData.timestamp || undefined,
          cloudTimestamp: firestoreResult.updatedAt || undefined,
          changedFields
        }
      }

      return null
    } catch (error) {
      console.error('Error syncing with localStorage:', error)
      return null
    }
  }

  /**
   * Checks if a user has data saved in Firestore
   */
  static async hasCharacter(userId: string): Promise<boolean> {
    if (!isFirebaseConfigured || !db) {
      return false
    }

    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists()
    } catch (error) {
      console.error('Error checking if character exists:', error)
      return false
    }
  }
}
