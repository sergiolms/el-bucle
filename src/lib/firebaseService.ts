import { doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
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

/**
 * Servicio para manejar todas las operaciones de Firestore relacionadas con personajes
 */
export class FirebaseCharacterService {
  /**
   * Obtiene el documento de un personaje desde Firestore
   */
  static async getCharacter(userId: string): Promise<CharacterData | null> {
    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as CharacterDocument
        // Remover campos internos antes de devolver
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
   * Guarda o actualiza un personaje en Firestore
   */
  static async saveCharacter(userId: string, character: CharacterData): Promise<void> {
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
   * Actualiza campos específicos de un personaje en Firestore
   */
  static async updateCharacter(userId: string, updates: Partial<CharacterData>): Promise<void> {
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
   * Elimina un personaje de Firestore
   */
  static async deleteCharacter(userId: string): Promise<void> {
    try {
      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting character from Firestore:', error)
      throw error
    }
  }

  /**
   * Escucha cambios en tiempo real de un personaje
   */
  static subscribeToCharacter(
    userId: string,
    onUpdate: (character: CharacterData) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
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
   * Migra datos de localStorage a Firestore
   * Se ejecuta una sola vez cuando el usuario se autentica por primera vez
   */
  static async migrateFromLocalStorage(userId: string): Promise<boolean> {
    try {
      // Verificar si ya existe el personaje en Firestore
      const existingCharacter = await this.getCharacter(userId)
      if (existingCharacter) {
        // Ya existe en Firestore, no migrar
        return false
      }

      // Intentar cargar de localStorage
      const localData = localStorage.getItem(LOCALSTORAGE_KEY)
      if (!localData) {
        // No hay datos en localStorage
        return false
      }

      const characterData = JSON.parse(localData) as CharacterData

      // Guardar en Firestore
      await this.saveCharacter(userId, characterData)

      console.log('✅ Datos migrados de localStorage a Firestore exitosamente')
      return true
    } catch (error) {
      console.error('Error migrating from localStorage to Firestore:', error)
      return false
    }
  }

  /**
   * Guarda en localStorage con timestamp
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
   * Carga datos de localStorage con timestamp
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
   * Sincroniza datos entre localStorage y Firestore
   * Usa timestamps para determinar cuál es más reciente
   * REGLA: Si no hay datos locales, SIEMPRE usa Firestore (no lo machaques)
   */
  static async syncWithLocalStorage(userId: string): Promise<CharacterData | null> {
    try {
      // Obtener datos de ambas fuentes
      const localData = this.loadFromLocalStorage()
      const firestoreDoc = await this.getCharacter(userId)

      // Si no hay datos en ninguna fuente
      if (!localData && !firestoreDoc) {
        console.log('📭 No hay datos para sincronizar')
        return null
      }

      // ⚠️ IMPORTANTE: Si no hay datos locales pero SÍ en Firestore, SIEMPRE usar Firestore
      // (El usuario puede haber perdido sus datos locales)
      if (!localData && firestoreDoc) {
        console.log('📥 Recuperando datos de Firestore (localStorage vacío)')
        this.saveToLocalStorage(firestoreDoc, Date.now())
        return firestoreDoc
      }

      // Si solo hay datos locales, subirlos a Firestore
      if (localData && !firestoreDoc) {
        console.log('📤 Subiendo datos locales a Firestore (primera sincronización)')
        await this.saveCharacter(userId, localData.character)
        return localData.character
      }

      // Si hay datos en ambas fuentes, usar el más reciente por timestamp
      if (localData && firestoreDoc) {
        const firestoreTimestamp = new Date((await getDoc(doc(db, CHARACTERS_COLLECTION, userId))).data()?.updatedAt || 0).getTime()

        // Si localStorage no tiene timestamp, significa que puede ser data antigua
        // En ese caso, priorizar Firestore
        if (!localData.timestamp || localData.timestamp === 0) {
          console.log('⚠️ localStorage sin timestamp, usando Firestore por seguridad')
          this.saveToLocalStorage(firestoreDoc, firestoreTimestamp)
          return firestoreDoc
        }

        if (localData.timestamp > firestoreTimestamp) {
          console.log('🔄 Datos locales más recientes, subiendo a Firestore')
          await this.saveCharacter(userId, localData.character)
          return localData.character
        } else {
          console.log('🔄 Datos de Firestore más recientes, descargando')
          this.saveToLocalStorage(firestoreDoc, firestoreTimestamp)
          return firestoreDoc
        }
      }

      return null
    } catch (error) {
      console.error('Error syncing with localStorage:', error)
      return null
    }
  }

  /**
   * Verifica si un usuario tiene datos guardados en Firestore
   */
  static async hasCharacter(userId: string): Promise<boolean> {
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
