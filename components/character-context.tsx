
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

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

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const saved = localStorage.getItem("el-bucle-character")
    if (saved) {
      try {
        const loadedData = JSON.parse(saved)
        // Migrar datos antiguos si es necesario
        if (loadedData.items && loadedData.items.length > 0 && typeof loadedData.items[0] === "string") {
          loadedData.items = loadedData.items.map((item: string, index: number) => ({
            id: `item-${index}-${Date.now()}`,
            name: item,
            locked: false,
          }))
        }
        // Migrar armas sin campo locked
        if (loadedData.weapons && loadedData.weapons.length > 0 && loadedData.weapons[0].locked === undefined) {
          loadedData.weapons = loadedData.weapons.map((weapon: any) => ({
            ...weapon,
            locked: false,
          }))
        }
        // Migrar armas sin campos elementales
        if (loadedData.weapons && loadedData.weapons.length > 0 && loadedData.weapons[0].elementalType === undefined) {
          loadedData.weapons = loadedData.weapons.map((weapon: any) => ({
            ...weapon,
            elementalType: "none",
            elementalDamage: 0,
          }))
        }
        // Añadir campos de combate si no existen
        if (!loadedData.enemies) loadedData.enemies = []
        if (!loadedData.selectedWeaponId) loadedData.selectedWeaponId = null
        if (!loadedData.lastPlayerRoll) loadedData.lastPlayerRoll = null
        if (loadedData.useElementalDamage === undefined) loadedData.useElementalDamage = false

        // Migrar enemigos sin nuevos campos
        if (loadedData.enemies && loadedData.enemies.length > 0) {
          loadedData.enemies = loadedData.enemies.map((enemy: any) => ({
            id: enemy.id,
            body: enemy.body || 0,
            maxLife: enemy.maxLife || 1,
            currentLife: enemy.currentLife || enemy.maxLife || 1,
            weaponDamage: enemy.weaponBonus || enemy.weaponDamage || 0,
            elementalType: enemy.elementalType || "none",
            elementalDamage: enemy.elementalDamage || 0,
            useElementalDamage: enemy.useElementalDamage || false,
            lastRoll: enemy.lastRoll || null,
            // Remover campos antiguos
            name: undefined,
            weaponName: undefined,
            weaponBonus: undefined,
          }))
        }

        // Add migration for currentSection
        if (loadedData.currentSection === undefined) {
          loadedData.currentSection = ""
        }

        // Add migration for credits
        if (loadedData.credits === undefined) {
          loadedData.credits = 0
        }

        setCharacter(loadedData)
      } catch (error) {
        console.error("Error loading character data:", error)
      }
    }
  }, [])

  // Guardar en localStorage cuando cambie el personaje
  useEffect(() => {
    localStorage.setItem("el-bucle-character", JSON.stringify(character))
  }, [character])

  const updateCharacter = (updates: Partial<CharacterData>) => {
    setCharacter((prev) => ({ ...prev, ...updates }))
  }

  const addItem = (itemName: string) => {
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
  }

  const removeItem = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const toggleItemLock = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item)),
    }))
  }

  const addWeapon = (weapon: Omit<Weapon, "id">) => {
    if (character.weapons.length < 3) {
      setCharacter((prev) => ({
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
      }))
    }
  }

  const removeWeapon = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.filter((w) => w.id !== id),
      selectedWeaponId: prev.selectedWeaponId === id ? null : prev.selectedWeaponId,
    }))
  }

  const updateWeapon = (id: string, updates: Partial<Weapon>) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }))
  }

  const toggleWeaponLock = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((weapon) => (weapon.id === id ? { ...weapon, locked: !weapon.locked } : weapon)),
    }))
  }

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
      day: prev.day + 1, // Incrementar día automáticamente
      hour: 8, // Reiniciar a las 8:00
      items: prev.items.filter((item) => item.locked), // Mantener solo items con candado
      weapons: prev.weapons.filter((weapon) => weapon.locked), // Mantener solo armas con candado
      clues: prev.clues.filter((c) => c.type !== "temporal"), // Mantener solo pistas normales
      enemies: [], // Borrar enemigos
      selectedWeaponId: prev.weapons.find((w) => w.locked && w.id === prev.selectedWeaponId)
        ? prev.selectedWeaponId
        : null,
      lastPlayerRoll: null,
      useElementalDamage: false,
      credits: 0, // Reset credits to 0
      // Las notas y currentSection se mantienen intactas
    }))
  }

  const resetAll = () => {
    setCharacter((prev) => ({
      ...defaultCharacter,
      notes: prev.notes, // Preservar las notas
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
