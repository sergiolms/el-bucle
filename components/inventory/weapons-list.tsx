import { Button } from "@/components/ui/button"
import { Trash2, Lock, Unlock, Sword, Target } from "lucide-react"
import { getElementalIcon, getElementalColor } from "@/lib/elemental-utils"
import { AddWeaponForm } from "./add-weapon-form"
import type { Weapon } from "../character-context"
import type { ElementalType } from "@/lib/elemental-utils"

interface WeaponsListProps {
  weapons: Weapon[]
  maxWeapons: number
  onAdd: (weapon: {
    name: string
    bonus: number
    type: "melee" | "ranged"
    elementalType: ElementalType
    elementalDamage: number
  }) => void
  onRemove: (id: string) => void
  onToggleLock: (id: string) => void
}

export function WeaponsList({ weapons, maxWeapons, onAdd, onRemove, onToggleLock }: WeaponsListProps) {
  return (
    <div>
      <h3 className="text-lg font-mono text-yellow-400 mb-3">
        ARMAS ({weapons.length}/{maxWeapons})
      </h3>

      {weapons.length < maxWeapons && <AddWeaponForm onAdd={onAdd} />}

      <div className="space-y-3">
        {weapons.map((weapon) => (
          <div
            key={weapon.id}
            className="flex items-center justify-between p-3 bg-black/20 rounded border border-yellow-400/20"
          >
            <div className="flex items-center gap-2 flex-1">
              {weapon.type === "melee" ? (
                <Sword className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              ) : (
                <Target className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
                <span className="text-yellow-100 font-mono font-bold text-sm">{weapon.name}</span>
                <span className="text-yellow-400 font-mono text-xs">+{weapon.bonus}</span>
                {weapon.elementalType !== "none" && (
                  <span className={`flex items-center gap-1 font-mono text-xs ${getElementalColor(weapon.elementalType)}`}>
                    {getElementalIcon(weapon.elementalType)}
                    +{weapon.elementalDamage}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleLock(weapon.id)}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20 p-1"
              >
                {weapon.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(weapon.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {weapons.length === 0 && (
          <div className="text-center text-yellow-400/50 font-mono py-4">No hay armas</div>
        )}
      </div>
      {weapons.some((w) => w.locked) && (
        <div className="mt-2 text-xs text-yellow-400/70 font-mono flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Las armas bloqueadas no se borran en el reset diario
        </div>
      )}
    </div>
  )
}
