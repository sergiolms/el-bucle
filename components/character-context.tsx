"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Weapon {
  id: string
  name: string
  bonus: number
  type: "melee" | "ranged"
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

export interface CharacterData {
  // Atributos
  body: number
  mind: number
  gesta: number
  status: "sano" | "herido" | "grave" | "muerto"

  // Inventario
  items: string[]
  weapons: Weapon[]

  // Pistas
  clues: Clue[]

  // Tiempo
  day: number
  hour: number

  // Notas
  notes: Note[]
}

const defaultCharacter: CharacterData = {
  body: 0,
  mind: 0,
  gesta: 0,
  status: "sano",
  items: [],
  weapons: [],
  clues: [],
  day: 1,
  hour: 8,
  notes: [],
}

interface CharacterContextType {
  character: CharacterData
  updateCharacter: (updates: Partial<CharacterData>) => void
  addItem: (item: string) => void
  removeItem: (index: number) => void
  addWeapon: (weapon: Omit<Weapon, "id">) => void
  removeWeapon: (id: string) => void
  updateWeapon: (id: string, updates: Partial<Weapon>) => void
  addClue: (text: string, type: "normal" | "temporal") => void
  removeClue: (id: string) => void
  clearTemporalClues: () => void
  addNote: () => void
  removeNote: (id: string) => void
  updateNote: (id: string, updates: Partial<Note>) => void
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined)

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacter] = useState<CharacterData>(defaultCharacter)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const saved = localStorage.getItem("el-bucle-character")
    if (saved) {
      try {
        setCharacter(JSON.parse(saved))
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

  const addItem = (item: string) => {
    if (item.trim()) {
      setCharacter((prev) => ({
        ...prev,
        items: [...prev.items, item.trim()],
      }))
    }
  }

  const removeItem = (index: number) => {
    setCharacter((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const addWeapon = (weapon: Omit<Weapon, "id">) => {
    if (character.weapons.length < 3) {
      setCharacter((prev) => ({
        ...prev,
        weapons: [...prev.weapons, { ...weapon, id: Date.now().toString() }],
      }))
    }
  }

  const removeWeapon = (id: string) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.filter((w) => w.id !== id),
    }))
  }

  const updateWeapon = (id: string, updates: Partial<Weapon>) => {
    setCharacter((prev) => ({
      ...prev,
      weapons: prev.weapons.map((w) => (w.id === id ? { ...w, ...updates } : w)),
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

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        addItem,
        removeItem,
        addWeapon,
        removeWeapon,
        updateWeapon,
        addClue,
        removeClue,
        clearTemporalClues,
        addNote,
        removeNote,
        updateNote,
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
