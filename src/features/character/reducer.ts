import {
  MAX_WEAPONS,
  defaultCharacter,
  type CharacterData,
  type Enemy,
  type Note,
  type Weapon,
} from "./model"

function createId() {
  return Date.now().toString()
}

function createItemId() {
  return `item-${Date.now()}`
}

function preserveSelectedWeapon(character: CharacterData) {
  return character.weapons.find((weapon) => weapon.locked && weapon.id === character.selectedWeaponId)
    ? character.selectedWeaponId
    : null
}

export function replaceCharacterState(previousCharacter: CharacterData, nextCharacter: CharacterData) {
  const previousSnapshot = JSON.stringify(previousCharacter)
  const nextSnapshot = JSON.stringify(nextCharacter)

  if (previousSnapshot === nextSnapshot) {
    return previousCharacter
  }

  return nextCharacter
}

export function resetCharacterDay(character: CharacterData): CharacterData {
  const weapons = character.weapons.filter((weapon) => weapon.locked)

  return {
    ...character,
    day: character.day + 1,
    hour: 8,
    items: character.items.filter((item) => item.locked),
    weapons,
    clues: character.clues.filter((clue) => clue.type !== "temporal"),
    enemies: [],
    selectedWeaponId: preserveSelectedWeapon({ ...character, weapons }),
    lastPlayerRoll: null,
    useElementalDamage: false,
    credits: 0,
  }
}

export function resetCharacterAll(character: CharacterData): CharacterData {
  return {
    ...defaultCharacter,
    notes: character.notes,
    currentSection: character.currentSection,
  }
}

export type CharacterAction =
  | { type: "merge-updates"; updates: Partial<CharacterData> }
  | { type: "replace-character"; nextCharacter: CharacterData }
  | { type: "add-item"; itemName: string }
  | { type: "remove-item"; itemId: string }
  | { type: "toggle-item-lock"; itemId: string }
  | { type: "add-weapon"; weapon: Omit<Weapon, "id" | "locked"> }
  | { type: "remove-weapon"; weaponId: string }
  | { type: "update-weapon"; weaponId: string; updates: Partial<Weapon> }
  | { type: "toggle-weapon-lock"; weaponId: string }
  | { type: "add-clue"; text: string; clueType: "normal" | "temporal" }
  | { type: "remove-clue"; clueId: string }
  | { type: "clear-temporal-clues" }
  | { type: "add-note" }
  | { type: "remove-note"; noteId: string }
  | { type: "update-note"; noteId: string; updates: Partial<Note> }
  | { type: "add-enemy"; enemy: Omit<Enemy, "id" | "currentLife" | "lastRoll"> }
  | { type: "remove-enemy"; enemyId: string }
  | { type: "update-enemy"; enemyId: string; updates: Partial<Enemy> }
  | { type: "set-player-roll"; roll: number }
  | { type: "set-enemy-roll"; enemyId: string; roll: number }
  | { type: "reset-day" }
  | { type: "reset-all" }

export function characterReducer(character: CharacterData, action: CharacterAction): CharacterData {
  switch (action.type) {
    case "merge-updates":
      return { ...character, ...action.updates }
    case "replace-character":
      return replaceCharacterState(character, action.nextCharacter)
    case "add-item":
      if (!action.itemName.trim()) return character

      return {
        ...character,
        items: [
          ...character.items,
          {
            id: createItemId(),
            name: action.itemName.trim(),
            locked: false,
          },
        ],
      }
    case "remove-item":
      return {
        ...character,
        items: character.items.filter((item) => item.id !== action.itemId),
      }
    case "toggle-item-lock":
      return {
        ...character,
        items: character.items.map((item) =>
          item.id === action.itemId ? { ...item, locked: !item.locked } : item
        ),
      }
    case "add-weapon":
      if (character.weapons.length >= MAX_WEAPONS) {
        return character
      }

      return {
        ...character,
        weapons: [
          ...character.weapons,
          {
            ...action.weapon,
            id: createId(),
            locked: false,
          },
        ],
      }
    case "remove-weapon":
      return {
        ...character,
        weapons: character.weapons.filter((weapon) => weapon.id !== action.weaponId),
        selectedWeaponId:
          character.selectedWeaponId === action.weaponId ? null : character.selectedWeaponId,
      }
    case "update-weapon":
      return {
        ...character,
        weapons: character.weapons.map((weapon) =>
          weapon.id === action.weaponId ? { ...weapon, ...action.updates } : weapon
        ),
      }
    case "toggle-weapon-lock":
      return {
        ...character,
        weapons: character.weapons.map((weapon) =>
          weapon.id === action.weaponId ? { ...weapon, locked: !weapon.locked } : weapon
        ),
      }
    case "add-clue":
      if (!action.text.trim()) return character

      return {
        ...character,
        clues: [
          ...character.clues,
          {
            id: createId(),
            text: action.text.trim(),
            type: action.clueType,
          },
        ],
      }
    case "remove-clue":
      return {
        ...character,
        clues: character.clues.filter((clue) => clue.id !== action.clueId),
      }
    case "clear-temporal-clues":
      return {
        ...character,
        clues: character.clues.filter((clue) => clue.type !== "temporal"),
      }
    case "add-note":
      return {
        ...character,
        notes: [
          ...character.notes,
          {
            id: createId(),
            what: "",
            where: "",
            when: "",
            other: "",
          },
        ],
      }
    case "remove-note":
      return {
        ...character,
        notes: character.notes.filter((note) => note.id !== action.noteId),
      }
    case "update-note":
      return {
        ...character,
        notes: character.notes.map((note) =>
          note.id === action.noteId ? { ...note, ...action.updates } : note
        ),
      }
    case "add-enemy":
      return {
        ...character,
        enemies: [
          ...character.enemies,
          {
            ...action.enemy,
            id: createId(),
            currentLife: action.enemy.maxLife,
            lastRoll: null,
          },
        ],
      }
    case "remove-enemy":
      return {
        ...character,
        enemies: character.enemies.filter((enemy) => enemy.id !== action.enemyId),
      }
    case "update-enemy":
      return {
        ...character,
        enemies: character.enemies.map((enemy) =>
          enemy.id === action.enemyId ? { ...enemy, ...action.updates } : enemy
        ),
      }
    case "set-player-roll":
      return {
        ...character,
        lastPlayerRoll: action.roll,
      }
    case "set-enemy-roll":
      return {
        ...character,
        enemies: character.enemies.map((enemy) =>
          enemy.id === action.enemyId ? { ...enemy, lastRoll: action.roll } : enemy
        ),
      }
    case "reset-day":
      return resetCharacterDay(character)
    case "reset-all":
      return resetCharacterAll(character)
    default:
      return character
  }
}
