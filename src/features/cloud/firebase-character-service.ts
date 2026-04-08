import type { Unsubscribe } from "firebase/firestore"
import type { CharacterData } from "@/src/features/character/model"
import {
  getCurrentCharacterRecord,
  saveCurrentCharacter,
} from "@/src/features/persistence"
import { getFirestoreService, isFirebaseConfigured } from "./firebase"

const CHARACTERS_COLLECTION = "characters"

export interface CharacterDocument extends CharacterData {
  userId: string
  createdAt: string
  updatedAt: string
}

export interface SyncResult {
  character: CharacterData
  hasConflict: boolean
  conflictType?: "cloud-recovery" | "data-mismatch"
  localData?: CharacterData
  cloudData?: CharacterData
  localTimestamp?: number
  cloudTimestamp?: string
  changedFields?: string[]
}

let persistenceEnabledPromise: Promise<void> | null = null

export class FirebaseCharacterService {
  static async enableOfflinePersistence(): Promise<void> {
    if (!isFirebaseConfigured) return

    if (!persistenceEnabledPromise) {
      persistenceEnabledPromise = (async () => {
        const [{ enableIndexedDbPersistence }, db] = await Promise.all([
          import("firebase/firestore"),
          getFirestoreService(),
        ])

        if (!db) return

        try {
          await enableIndexedDbPersistence(db)
        } catch (err: any) {
          if (err.code === "failed-precondition") {
            console.warn("⚠️ Multiple tabs open, persistence only works in one.")
          } else if (err.code === "unimplemented") {
            console.warn("⚠️ This browser does not support offline persistence.")
          }
        }
      })()
    }

    await persistenceEnabledPromise
  }

  static async getCharacter(userId: string): Promise<CharacterData | null> {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured")
      return null
    }

    try {
      const [{ doc, getDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return null

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null
      }

      const data = docSnap.data() as CharacterDocument
      const { userId: _, createdAt: __, updatedAt: ___, ...characterData } = data
      return characterData
    } catch (error) {
      console.error("Error getting character from Firestore:", error)
      return null
    }
  }

  static async saveCharacter(userId: string, character: CharacterData): Promise<void> {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured")
      return
    }

    try {
      const [{ doc, getDoc, setDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      const characterDoc: CharacterDocument = {
        ...character,
        userId,
        createdAt: docSnap.exists()
          ? (docSnap.data() as CharacterDocument).createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await setDoc(docRef, characterDoc)
    } catch (error) {
      console.error("Error saving character to Firestore:", error)
      throw error
    }
  }

  static async updateCharacter(userId: string, updates: Partial<CharacterData>): Promise<void> {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured")
      return
    }

    try {
      const [{ doc, updateDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error updating character in Firestore:", error)
      throw error
    }
  }

  static async deleteCharacter(userId: string): Promise<void> {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured")
      return
    }

    try {
      const [{ doc, deleteDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error deleting character from Firestore:", error)
      throw error
    }
  }

  static async subscribeToCharacter(
    userId: string,
    onUpdate: (character: CharacterData) => void,
    onError?: (error: Error) => void
  ): Promise<Unsubscribe> {
    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured")
      return () => {}
    }

    const [{ doc, onSnapshot }, db] = await Promise.all([
      import("firebase/firestore"),
      getFirestoreService(),
    ])

    if (!db) {
      return () => {}
    }

    const docRef = doc(db, CHARACTERS_COLLECTION, userId)

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) return

        const data = snapshot.data() as CharacterDocument
        const { userId: _, createdAt: __, updatedAt: ___, ...characterData } = data
        onUpdate(characterData)
      },
      (error) => {
        console.error("Error listening to character changes:", error)
        if (onError) onError(error)
      }
    )
  }

  static async migrateFromLocalStore(userId: string): Promise<boolean> {
    try {
      const existingCharacter = await this.getCharacter(userId)
      if (existingCharacter) {
        return false
      }

      const localRecord = await getCurrentCharacterRecord()
      if (!localRecord) {
        return false
      }

      await this.saveCharacter(userId, localRecord.character)

      console.log("✅ Data migrated from local storage to Firestore successfully")
      return true
    } catch (error) {
      console.error("Error migrating from local storage to Firestore:", error)
      return false
    }
  }

  static async getCharacterWithTimestamp(userId: string): Promise<{
    character: CharacterData
    updatedAt: string | null
  } | null> {
    if (!isFirebaseConfigured) return null

    try {
      const [{ doc, getDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return null

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return null
      }

      const data = docSnap.data() as CharacterDocument
      const { userId: _, createdAt: __, updatedAt, ...characterData } = data
      return { character: characterData, updatedAt: updatedAt || null }
    } catch (error) {
      console.error("Error getting character from Firestore:", error)
      return null
    }
  }

  private static stableArrayStringify(items: { id: string }[]): string {
    const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id))
    return JSON.stringify(
      sorted.map((item) =>
        Object.fromEntries(
          Object.entries(item).sort(([a], [b]) => a.localeCompare(b))
        )
      )
    )
  }

  static compareCharacterData(
    a: CharacterData,
    b: CharacterData
  ): { isEqual: boolean; changedFields: string[] } {
    const changedFields: string[] = []

    if (a.body !== b.body) changedFields.push("body")
    if (a.mind !== b.mind) changedFields.push("mind")
    if (a.gesta !== b.gesta) changedFields.push("gesta")
    if (a.status !== b.status) changedFields.push("status")
    if (a.credits !== b.credits) changedFields.push("credits")
    if (a.day !== b.day) changedFields.push("day")
    if (a.hour !== b.hour) changedFields.push("hour")
    if (a.selectedWeaponId !== b.selectedWeaponId) changedFields.push("selectedWeaponId")
    if (a.lastPlayerRoll !== b.lastPlayerRoll) changedFields.push("lastPlayerRoll")
    if (a.useElementalDamage !== b.useElementalDamage) changedFields.push("useElementalDamage")
    if (a.currentSection !== b.currentSection) changedFields.push("currentSection")

    if (this.stableArrayStringify(a.items) !== this.stableArrayStringify(b.items)) changedFields.push("items")
    if (this.stableArrayStringify(a.weapons) !== this.stableArrayStringify(b.weapons)) changedFields.push("weapons")
    if (this.stableArrayStringify(a.clues) !== this.stableArrayStringify(b.clues)) changedFields.push("clues")
    if (this.stableArrayStringify(a.notes) !== this.stableArrayStringify(b.notes)) changedFields.push("notes")
    if (this.stableArrayStringify(a.enemies) !== this.stableArrayStringify(b.enemies)) changedFields.push("enemies")

    return {
      isEqual: changedFields.length === 0,
      changedFields,
    }
  }

  static async syncWithLocalData(userId: string): Promise<SyncResult | null> {
    try {
      const localRecord = await getCurrentCharacterRecord()
      const firestoreResult = await this.getCharacterWithTimestamp(userId)

      if (!localRecord && !firestoreResult) {
        console.log("📭 No data to synchronize")
        return null
      }

      if (!localRecord && firestoreResult) {
        console.log("📥 Cloud data found but no local data - asking user")
        return {
          character: firestoreResult.character,
          hasConflict: true,
          conflictType: "cloud-recovery",
          cloudData: firestoreResult.character,
          cloudTimestamp: firestoreResult.updatedAt || undefined,
          changedFields: [],
        }
      }

      if (localRecord && !firestoreResult) {
        console.log("📤 Uploading local data to Firestore (first sync)")
        await this.saveCharacter(userId, localRecord.character)
        return {
          character: localRecord.character,
          hasConflict: false,
        }
      }

      if (localRecord && firestoreResult) {
        const { isEqual, changedFields } = this.compareCharacterData(
          localRecord.character,
          firestoreResult.character
        )

        if (isEqual) {
          console.log("✅ Local and cloud data are identical")
          await saveCurrentCharacter(firestoreResult.character)
          return {
            character: firestoreResult.character,
            hasConflict: false,
          }
        }

        console.log("⚠️ CONFLICT: Data content differs in fields:", changedFields)
        return {
          character: firestoreResult.character,
          hasConflict: true,
          conflictType: "data-mismatch",
          localData: localRecord.character,
          cloudData: firestoreResult.character,
          localTimestamp: localRecord.updatedAt || undefined,
          cloudTimestamp: firestoreResult.updatedAt || undefined,
          changedFields,
        }
      }

      return null
    } catch (error) {
      console.error("Error syncing with local data:", error)
      return null
    }
  }

  static async hasCharacter(userId: string): Promise<boolean> {
    if (!isFirebaseConfigured) {
      return false
    }

    try {
      const [{ doc, getDoc }, db] = await Promise.all([
        import("firebase/firestore"),
        getFirestoreService(),
      ])

      if (!db) return false

      const docRef = doc(db, CHARACTERS_COLLECTION, userId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists()
    } catch (error) {
      console.error("Error checking if character exists:", error)
      return false
    }
  }
}
