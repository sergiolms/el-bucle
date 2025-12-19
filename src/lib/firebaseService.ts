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
  localData?: CharacterData
  cloudData?: CharacterData
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
   * Synchronizes data between localStorage and Firestore
   * Detects conflicts when both have data
   * RULE: If there's no local data, ALWAYS use Firestore (don't overwrite it)
   */
  static async syncWithLocalStorage(userId: string): Promise<SyncResult | null> {
    try {
      // Get data from both sources
      const localData = this.loadFromLocalStorage()
      const firestoreDoc = await this.getCharacter(userId)

      // If there's no data in either source
      if (!localData && !firestoreDoc) {
        console.log('📭 No data to synchronize')
        return null
      }

      // ⚠️ IMPORTANT: If there's no local data but YES in Firestore, ALWAYS use Firestore
      // (User may have lost their local data)
      if (!localData && firestoreDoc) {
        console.log('📥 Recovering data from Firestore (localStorage empty)')
        this.saveToLocalStorage(firestoreDoc, Date.now())
        return {
          character: firestoreDoc,
          hasConflict: false
        }
      }

      // If there's only local data, upload it to Firestore
      if (localData && !firestoreDoc) {
        console.log('📤 Uploading local data to Firestore (first sync)')
        await this.saveCharacter(userId, localData.character)
        return {
          character: localData.character,
          hasConflict: false
        }
      }

      // If there's data in both sources, detect conflict
      if (localData && firestoreDoc) {
        if (!db) return {
          character: localData.character,
          hasConflict: false
        }

        const firestoreTimestamp = new Date((await getDoc(doc(db, CHARACTERS_COLLECTION, userId))).data()?.updatedAt || 0).getTime()

        // If localStorage has no timestamp, THERE'S A CONFLICT
        // We can't determine which is more recent
        if (!localData.timestamp || localData.timestamp === 0) {
          console.log('⚠️ CONFLICT: localStorage without timestamp')
          return {
            character: firestoreDoc, // Temporary default
            hasConflict: true,
            localData: localData.character,
            cloudData: firestoreDoc
          }
        }

        // If timestamps are very different (more than 10 seconds), THERE'S A CONFLICT
        const timeDiff = Math.abs(localData.timestamp - firestoreTimestamp)
        if (timeDiff > 10000) { // 10 seconds
          console.log('⚠️ CONFLICT: Different data detected')
          return {
            character: firestoreDoc, // Temporary default
            hasConflict: true,
            localData: localData.character,
            cloudData: firestoreDoc
          }
        }

        // If they're similar in timestamp, use the most recent automatically
        if (localData.timestamp > firestoreTimestamp) {
          console.log('🔄 Local data more recent, uploading to Firestore')
          await this.saveCharacter(userId, localData.character)
          return {
            character: localData.character,
            hasConflict: false
          }
        } else {
          console.log('🔄 Firestore data more recent, downloading')
          this.saveToLocalStorage(firestoreDoc, firestoreTimestamp)
          return {
            character: firestoreDoc,
            hasConflict: false
          }
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
