import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DiceRoller } from "@/components/ui/dice-roller"
import { getElementalIcon, getElementalColor } from "@/lib/elemental-utils"
import { Trash2, Heart, Skull, Sword, User } from "lucide-react"
import type { Enemy } from "../character-context"

interface EnemyCardProps {
  enemy: Enemy
  index: number
  isRolling: boolean
  diceDisplay: number | null
  onRoll: () => void
  onRemove: () => void
  onUpdateLife: (delta: number) => void
  onUpdateBody: (delta: number) => void
  onToggleElemental: (checked: boolean) => void
  getEnemyName: (index: number) => string
}

export function EnemyCard({
  enemy,
  index,
  isRolling,
  diceDisplay,
  onRoll,
  onRemove,
  onUpdateLife,
  onUpdateBody,
  onToggleElemental,
  getEnemyName
}: EnemyCardProps) {
  const getEnemyTotal = () => {
    const weaponDamage =
      enemy.useElementalDamage && enemy.elementalType !== "none" ? enemy.elementalDamage : enemy.weaponDamage
    return enemy.body + weaponDamage + (enemy.lastRoll || 0)
  }

  return (
    <div className="bg-black/10 backdrop-blur-md border border-red-400/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-red-400 font-mono font-bold">{getEnemyName(index)}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Vida */}
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-4 h-4 text-red-400" />
        <span className="text-red-300 font-mono text-sm">Vida:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateLife(-1)}
            className="text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
          >
            -
          </Button>
          <span className={`font-mono font-bold px-2 ${enemy.currentLife <= 0 ? "text-red-600" : "text-red-300"}`}>
            {enemy.currentLife}/{enemy.maxLife}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateLife(1)}
            className="text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
          >
            +
          </Button>
        </div>
        {enemy.currentLife <= 0 && <Skull className="w-4 h-4 text-red-600 ml-2" />}
      </div>

      {/* Cuerpo */}
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-pink-400" />
        <span className="text-pink-300 font-mono text-sm">Cuerpo:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateBody(-1)}
            className="text-pink-400 hover:bg-pink-400/20 w-6 h-6 p-0"
          >
            -
          </Button>
          <span className="font-mono font-bold px-2 text-pink-300">{enemy.body}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateBody(1)}
            className="text-pink-400 hover:bg-pink-400/20 w-6 h-6 p-0"
          >
            +
          </Button>
        </div>
      </div>

      {/* Arma */}
      <div className="flex items-center gap-2 mb-3">
        <Sword className="w-4 h-4 text-orange-400" />
        <span className="text-orange-300 font-mono text-sm">
          Daño: +{enemy.weaponDamage}
          {enemy.elementalType !== "none" && (
            <span className={`ml-2 flex items-center gap-1 ${getElementalColor(enemy.elementalType)}`}>
              {getElementalIcon(enemy.elementalType)}+{enemy.elementalDamage}
            </span>
          )}
        </span>
      </div>

      {/* Toggle Elemental */}
      {enemy.elementalType !== "none" && (
        <div className="mb-3 p-2 bg-black/15 backdrop-blur-md rounded border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getElementalIcon(enemy.elementalType)}
              <span className={`font-mono text-xs ${getElementalColor(enemy.elementalType)}`}>
                Daño elemental (+{enemy.elementalDamage})
              </span>
            </div>
            <Switch
              checked={enemy.useElementalDamage}
              onCheckedChange={onToggleElemental}
            />
          </div>
        </div>
      )}

      {/* Dice Roller */}
      <DiceRoller
        value={enemy.lastRoll}
        displayValue={diceDisplay}
        isRolling={isRolling}
        onRoll={onRoll}
        color="orange"
        size="small"
        disabled={enemy.currentLife <= 0}
      />

      {/* Resultado */}
      {enemy.lastRoll && !isRolling && (
        <div className="bg-black/20 dark:bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-3">
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-mono flex-wrap">
            <span className="text-pink-400">Cuerpo: {enemy.body}</span>
            <span className="text-red-300">+</span>
            {enemy.useElementalDamage && enemy.elementalType !== "none" ? (
              <span className={`flex items-center gap-1 ${getElementalColor(enemy.elementalType)}`}>
                {getElementalIcon(enemy.elementalType)}
                {enemy.elementalDamage}
              </span>
            ) : (
              <span className="text-orange-400">Arma: {enemy.weaponDamage}</span>
            )}
            <span className="text-red-300">+</span>
            <span className="text-red-400">Dado: {enemy.lastRoll}</span>
            <span className="text-red-300">=</span>
            <span className="text-red-200 font-bold">Total: {getEnemyTotal()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
