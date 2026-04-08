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
  body: number
  mind: number
  gesta: number
  status: "sano" | "herido" | "grave" | "muerto"
  items: InventoryItem[]
  weapons: Weapon[]
  credits: number
  clues: Clue[]
  day: number
  hour: number
  notes: Note[]
  enemies: Enemy[]
  selectedWeaponId: string | null
  lastPlayerRoll: number | null
  useElementalDamage: boolean
  currentSection: string
}

export const MAX_WEAPONS = 3

export const defaultCharacter: CharacterData = {
  body: 0,
  mind: 0,
  gesta: 0,
  status: "sano",
  items: [],
  weapons: [],
  credits: 0,
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
