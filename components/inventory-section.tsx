import { useCharacter } from "./character-context"
import { CreditsInput } from "./inventory/credits-input"
import { ItemsList } from "./inventory/items-list"
import { WeaponsList } from "./inventory/weapons-list"

export function InventorySection() {
  const {
    character,
    addItem,
    removeItem,
    toggleItemLock,
    addWeapon,
    removeWeapon,
    toggleWeaponLock,
    updateCharacter,
  } = useCharacter()

  return (
    <div className="retro-card border-retro-cyan">
      <div className="relative mb-6">
        <h2 className="retro-heading text-xl sm:text-2xl text-center text-retro-cyan">
          INVENTARIO
        </h2>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>
      </div>

      <CreditsInput
        value={character.credits}
        onChange={(val) => updateCharacter({ credits: val })}
      />

      <ItemsList
        items={character.items}
        onAdd={addItem}
        onRemove={removeItem}
        onToggleLock={toggleItemLock}
      />

      <WeaponsList
        weapons={character.weapons}
        maxWeapons={3}
        onAdd={addWeapon}
        onRemove={removeWeapon}
        onToggleLock={toggleWeaponLock}
      />
    </div>
  )
}
