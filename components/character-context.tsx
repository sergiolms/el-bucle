
import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useAuth } from "@/src/lib/useAuth"
import { useFirestoreSync } from "@/src/lib/useFirestoreSync"
import { FirebaseCharacterService, SyncResult } from "@/src/lib/firebaseService"
import { DataConflictModal } from "./data-conflict-modal"

export interface Weapon {
  id: string
  name: string
  bonus: number
  type: "melee" | "ranged"
  locked: boolean
  elementalType: "none" | "fire" | "ice" | "thunder"
  elementalDamage: number
}

export interface Clue {
  id: string
  text: string
  type: "normal" | "temporal"
}

export interface Note {
  id: string
  what: string
  where: string
  when: string
  other: string
}

export interface InventoryItem {
  id: string
  name: string
  locked: boolean
}

export interface Enemy {
  id: string
  body: number
  maxLife: number
  currentLife: number
  weaponDamage: number
  elementalType: "none" | "fire" | "ice" | "thunder"
  elementalDamage: number
  useElementalDamage: boolean
  lastRoll: number | null
}

export interface CharacterData {
  // Atributos
  body: number
  mind: number
  gesta: number
  status: "sano" | "herido" | "grave" | "muerto"

  // Inventario
  items: InventoryItem[]
  weapons: Weapon[]
  credits: number // New field for credits

  // Pistas
  clues: Clue[]

  // Tiempo
  day: number
  hour: number

  // Notas
  notes: Note[]

  // Combate
  enemies: Enemy[]
  selectedWeaponId: string | null
  lastPlayerRoll: number | null
  useElementalDamage: boolean

  // Progreso del libro
  currentSection: string
}

const defaultCharacter: CharacterData = {
  body: 0,
  mind: 0,
  gesta: 0,
  status: "sano",
  items: [],
  weapons: [],
  credits: 0, // Initialize credits
  clues: [],
  day: 1,
  hour: 8,
  notes: [],
  enemies: [],
  selectedWeaponId: null,
  lastPlayerRoll: null,
  useElementalDamage: false,
  currentSection: "",
}

interface CharacterContextType {
  character: CharacterData
  updateCharacter: (updates: Partial<CharacterData>) => void
  addItem: (item: string) => void
  removeItem: (id: string) => void
  toggleItemLock: (id: string) => void
  addWeapon: (weapon: Omit<Weapon, "id">) => void
  removeWeapon: (id: string) => void
  updateWeapon: (id: string, updates: Partial<Weapon>) => void
  toggleWeaponLock: (id: string) => void
  addClue: (text: string, type: "normal" | "temporal") => void
  removeClue: (id: string) => void
  clearTemporalClues: () => void
  addNote: () => void
  removeNote: (id: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  addEnemy: (enemy: Omit<Enemy, "id" | "currentLife" | "lastRoll">) => void
  removeEnemy: (id: string) => void
  updateEnemy: (id: string, updates: Partial<Enemy>) => void
  rollPlayerDice: () => number
  rollEnemyDice: (enemyId: string) => number
  resetDay: () => void
  resetAll: () => void
  getEnemyName: (index: number) => string
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<CharacterData>(defaultCharacter)
  const [initialized, setInitialized] = useState(false)
  const [conflictData, setConflictData] = useState<SyncResult | null>(null)
  const { user } = useAuth()

  // Load initial data only once
  useEffect(() => {
    if (initialized) return

    const localData = FirebaseCharacterService.loadFromLocalStorage()
    if (localData) {
      setCharacter(localData.character)
    }
    setInitialized(true)
  }, [initialized])

  // Callback for Firestore updates (memoized and stable)
  const handleFirestoreUpdate = useCallback((data: CharacterData) => {
    setCharacter(prevCharacter => {
      // Only update if data is actually different
      const prevData = JSON.stringify(prevCharacter)
      const newData = JSON.stringify(data)

      if (prevData === newData) {
        return prevCharacter // Don't change if equal
      }

      return data
    })
  }, [])

  // Callback for handling conflicts
  const handleConflict = useCallback((syncResult: SyncResult) => {
    setConflictData(syncResult)
  }, [])

  // Handlers for conflict resolution
  const handleSelectLocal = useCallback(async () => {
    if (!conflictData || !user) return

    if (conflictData.localData) {
      // Data mismatch: use local data
      setCharacter(conflictData.localData)
      await FirebaseCharacterService.saveCharacter(user.uid, conflictData.localData)
      FirebaseCharacterService.saveToLocalStorage(conflictData.localData, Date.now())
    } else {
      // Cloud recovery declined: keep current state, sync it to cloud
      await FirebaseCharacterService.saveCharacter(user.uid, character)
      FirebaseCharacterService.saveToLocalStorage(character, Date.now())
    }

    setConflictData(null)
  }, [conflictData, user, character])

  const handleSelectCloud = useCallback(async () => {
    if (!conflictData || !conflictData.cloudData) return

    // Use cloud data
    setCharacter(conflictData.cloudData)

    // Save to localStorage
    FirebaseCharacterService.saveToLocalStorage(conflictData.cloudData, Date.now())

    setConflictData(null)
  }, [conflictData])

  // Firestore sync (only if there is a user)
  useFirestoreSync({
    userId: user?.uid || null,
    character,
    onUpdate: handleFirestoreUpdate,
    onConflict: handleConflict
  })

  // Memoize updateCharacter to avoid re-renders
  const updateCharacter = useCallback((updates: Partial<CharacterData>) => {
    setCharacter((prev) => ({ ...prev, ...updates }))
  }, [])

  const addItem = useCallback((itemName: string) => {
    if (itemName.trim()) {
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        name: itemName.trim(),
        locked: false,
      }
      setCharacter((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }))
    }
  }, [])

  const removeItem = useCallback((id: string) => {
    setCharacter((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }, [])

  const toggleItemLock = useCallback((id: string) => {
    setCharacter((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item)),
    }))
  }, [])

  const addWeapon = useCallback((weapon: Omit<Weapon, "id">) => {
    setCharacter((prev) => {
      if (prev.weapons.length >= 3) return prev
      return {
        ...prev,
        weapons: [
          ...prev.weapons,
          {
            ...weapon,
            id: Date.now().toString(),
            locked: false,
            elementalType: "none",
            elementalDamage: 0,
          },
        ],
      }
    })
  }, [])

  const removeWeapon = useCallback((id: string) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.filter((w) => w.id !== id),
      selectedWeaponId: prev.selectedWeaponId === id ? null : prev.selectedWeaponId,
    }))
  }, [])

  const updateWeapon = useCallback((id: string, updates: Partial<Weapon>) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }))
  }, [])

  const toggleWeaponLock = useCallback((id: string) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((weapon) => (weapon.id === id ? { ...weapon, locked: !weapon.locked } : weapon)),
    }))
  }, [])

  const addClue = (text: string, type: "normal" | "temporal") => {
    if (text.trim()) {
      setCharacter((prev) => ({
        ...prev,
        clues: [...prev.clues, { id: Date.now().toString(), text: text.trim(), type }],
      }))
    }
  }

  const removeClue = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      clues: prev.clues.filter((c) => c.id !== id),
    }))
  }

  const clearTemporalClues = () => {
    setCharacter((prev) => ({
      ...prev,
      clues: prev.clues.filter((c) => c.type !== "temporal"),
    }))
  }

  const addNote = () => {
    setCharacter((prev) => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          id: Date.now().toString(),
          what: "",
          where: "",
          when: "",
          other: "",
        },
      ],
    }))
  }

  const removeNote = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }))
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setCharacter((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }))
  }

  const addEnemy = (enemy: Omit<Enemy, "id" | "currentLife" | "lastRoll">) => {
    const newEnemy: Enemy = {
      ...enemy,
      id: Date.now().toString(),
      currentLife: enemy.maxLife,
      lastRoll: null,
    }
    setCharacter((prev) => ({
      ...prev,
      enemies: [...prev.enemies, newEnemy],
    }))
  }

  const removeEnemy = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      enemies: prev.enemies.filter((e) => e.id !== id),
    }))
  }

  const updateEnemy = (id: string, updates: Partial<Enemy>) => {
    setCharacter((prev) => ({
      ...prev,
      enemies: prev.enemies.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }))
  }

  const rollPlayerDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1
    setCharacter((prev) => ({
      ...prev,
      lastPlayerRoll: roll,
    }))
    return roll
  }

  const rollEnemyDice = (enemyId: string) => {
    const roll = Math.floor(Math.random() * 6) + 1
    setCharacter((prev) => ({
      ...prev,
      enemies: prev.enemies.map((e) => (e.id === enemyId ? { ...e, lastRoll: roll } : e)),
    }))
    return roll
  }

  const getEnemyName = (index: number) => {
    return `Enemigo ${index + 1}`
  }

  const resetDay = () => {
    setCharacter((prev) => ({
      ...prev,
      day: prev.day + 1, // Automatically increment day
      hour: 8, // Reset to 8:00
      items: prev.items.filter((item) => item.locked), // Keep only locked items
      weapons: prev.weapons.filter((weapon) => weapon.locked), // Keep only locked weapons
      clues: prev.clues.filter((c) => c.type !== "temporal"), // Keep only normal clues
      enemies: [], // Clear enemies
      selectedWeaponId: prev.weapons.find((w) => w.locked && w.id === prev.selectedWeaponId)
        ? prev.selectedWeaponId
        : null,
      lastPlayerRoll: null,
      useElementalDamage: false,
      credits: 0, // Reset credits to 0
      // Notes and currentSection remain intact
    }))
  }

  const resetAll = () => {
    setCharacter((prev) => ({
      ...defaultCharacter,
      notes: prev.notes, // Preserve notes
      currentSection: prev.currentSection, // Preserve currentSection
    }))
  }

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        addItem,
        removeItem,
        toggleItemLock,
        addWeapon,
        removeWeapon,
        updateWeapon,
        toggleWeaponLock,
        addClue,
        removeClue,
        clearTemporalClues,
        addNote,
        removeNote,
        updateNote,
        addEnemy,
        removeEnemy,
        updateEnemy,
        rollPlayerDice,
        rollEnemyDice,
        resetDay,
        resetAll,
        getEnemyName,
      }}
    >
      {children}

      {/* Data conflict modal */}
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
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error("useCharacter must be used within CharacterProvider")
  }
  return context
}
