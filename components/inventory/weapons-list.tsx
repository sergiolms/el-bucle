import { Trash2, Lock, Unlock, Sword, Target } from "lucide-react"
import { getElementalIcon, getElementalColor } from "@/lib/elemental-utils"
import { AddWeaponForm } from "./add-weapon-form"
import type { Weapon } from "../character-context"
import type { ElementalType } from "@/lib/elemental-utils"
import { IconActionButton } from "@/components/shared/icon-action-button"
import { ListRow } from "@/components/shared/list-row"

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
          <ListRow
            key={weapon.id}
            tone="yellow"
            highlighted={weapon.locked}
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="relative">
                {weapon.type === "melee" ? (
                  <Sword className={`w-4 h-4 flex-shrink-0 ${weapon.locked ? 'text-yellow-400' : 'text-yellow-400'}`} />
                ) : (
                  <Target className={`w-4 h-4 flex-shrink-0 ${weapon.locked ? 'text-yellow-400' : 'text-yellow-400'}`} />
                )}
                {weapon.locked && (
                  <Lock className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
                <div className="flex items-center gap-1">
                  <span className={`font-mono font-bold text-sm ${weapon.locked ? 'text-yellow-100' : 'text-yellow-100'}`}>
                    {weapon.name}
                  </span>
                  {weapon.locked && (
                    <span className="text-xs text-yellow-400/70 font-mono">[PROTEGIDO]</span>
                  )}
                </div>
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
              <IconActionButton
                onClick={() => onToggleLock(weapon.id)}
                tone={weapon.locked ? "warning" : "neutral"}
                title={weapon.locked ? 'Desbloquear' : 'Bloquear'}
                icon={weapon.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              />
              <IconActionButton
                onClick={() => onRemove(weapon.id)}
                disabled={weapon.locked}
                title={weapon.locked ? 'No se puede borrar (bloqueado)' : 'Eliminar'}
                tone="danger"
                icon={<Trash2 className="w-4 h-4" />}
              />
            </div>
          </ListRow>
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
