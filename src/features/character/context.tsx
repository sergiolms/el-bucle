import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react"
import { loadCurrentCharacter } from "@/src/features/persistence"
import { characterReducer } from "./reducer"
import { defaultCharacter, type CharacterData, type Enemy, type Note, type Weapon } from "./model"
import { getEnemyName } from "./selectors"

interface CharacterContextType {
  character: CharacterData
  updateCharacter: (updates: Partial<CharacterData>) => void
  replaceCharacter: (nextCharacter: CharacterData) => void
  addItem: (item: string) => void
  removeItem: (id: string) => void
  toggleItemLock: (id: string) => void
  addWeapon: (weapon: Omit<Weapon, "id" | "locked">) => void
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
  const [character, dispatch] = useReducer(characterReducer, defaultCharacter)

  useEffect(() => {
    let active = true

    void (async () => {
      const localCharacter = await loadCurrentCharacter()

      if (active && localCharacter) {
        dispatch({ type: "replace-character", nextCharacter: localCharacter })
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const updateCharacter = useCallback((updates: Partial<CharacterData>) => {
    dispatch({ type: "merge-updates", updates })
  }, [])

  const replaceCharacter = useCallback((nextCharacter: CharacterData) => {
    dispatch({ type: "replace-character", nextCharacter })
  }, [])

  const addItem = useCallback((itemName: string) => {
    dispatch({ type: "add-item", itemName })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: "remove-item", itemId })
  }, [])

  const toggleItemLock = useCallback((itemId: string) => {
    dispatch({ type: "toggle-item-lock", itemId })
  }, [])

  const addWeapon = useCallback((weapon: Omit<Weapon, "id" | "locked">) => {
    dispatch({ type: "add-weapon", weapon })
  }, [])

  const removeWeapon = useCallback((weaponId: string) => {
    dispatch({ type: "remove-weapon", weaponId })
  }, [])

  const updateWeapon = useCallback((weaponId: string, updates: Partial<Weapon>) => {
    dispatch({ type: "update-weapon", weaponId, updates })
  }, [])

  const toggleWeaponLock = useCallback((weaponId: string) => {
    dispatch({ type: "toggle-weapon-lock", weaponId })
  }, [])

  const addClue = useCallback((text: string, clueType: "normal" | "temporal") => {
    dispatch({ type: "add-clue", text, clueType })
  }, [])

  const removeClue = useCallback((clueId: string) => {
    dispatch({ type: "remove-clue", clueId })
  }, [])

  const clearTemporalClues = useCallback(() => {
    dispatch({ type: "clear-temporal-clues" })
  }, [])

  const addNote = useCallback(() => {
    dispatch({ type: "add-note" })
  }, [])

  const removeNote = useCallback((noteId: string) => {
    dispatch({ type: "remove-note", noteId })
  }, [])

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    dispatch({ type: "update-note", noteId, updates })
  }, [])

  const addEnemy = useCallback((enemy: Omit<Enemy, "id" | "currentLife" | "lastRoll">) => {
    dispatch({ type: "add-enemy", enemy })
  }, [])

  const removeEnemy = useCallback((enemyId: string) => {
    dispatch({ type: "remove-enemy", enemyId })
  }, [])

  const updateEnemy = useCallback((enemyId: string, updates: Partial<Enemy>) => {
    dispatch({ type: "update-enemy", enemyId, updates })
  }, [])

  const rollPlayerDice = useCallback(() => {
    const roll = Math.floor(Math.random() * 6) + 1
    dispatch({ type: "set-player-roll", roll })
    return roll
  }, [])

  const rollEnemyDice = useCallback((enemyId: string) => {
    const roll = Math.floor(Math.random() * 6) + 1
    dispatch({ type: "set-enemy-roll", enemyId, roll })
    return roll
  }, [])

  const resetDay = useCallback(() => {
    dispatch({ type: "reset-day" })
  }, [])

  const resetAll = useCallback(() => {
    dispatch({ type: "reset-all" })
  }, [])

  const contextValue = useMemo<CharacterContextType>(() => ({
    character,
    updateCharacter,
    replaceCharacter,
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
  }), [
    character,
    updateCharacter,
    replaceCharacter,
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
  ])

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
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

export type {
  CharacterData,
  Clue,
  Enemy,
  InventoryItem,
  Note,
  Weapon,
} from "./model"
