import type { CharacterData, Weapon } from "./model"

export function getEnemyName(index: number) {
  return `Enemigo ${index + 1}`
}

export function getSelectedWeapon(character: CharacterData): Weapon | undefined {
  return character.weapons.find((weapon) => weapon.id === character.selectedWeaponId)
}
