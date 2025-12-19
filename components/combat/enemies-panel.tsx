import { Skull } from "lucide-react"
import { useCharacter } from "../character-context"
import { AddEnemyForm } from "./add-enemy-form"
import { EnemyCard } from "./enemy-card"
import type { ElementalType } from "@/lib/elemental-utils"

interface EnemiesPanelProps {
  rollingEnemies: Set<string>
  enemyDiceDisplay: Record<string, number>
  onEnemyRoll: (enemyId: string) => void
}

export function EnemiesPanel({ rollingEnemies, enemyDiceDisplay, onEnemyRoll }: EnemiesPanelProps) {
  const { character, addEnemy, removeEnemy, updateEnemy, getEnemyName } = useCharacter()

  const handleAddEnemy = (newEnemy: {
    body: number
    maxLife: number
    weaponDamage: number
    elementalType: ElementalType
    elementalDamage: number
    useElementalDamage: boolean
  }) => {
    addEnemy(newEnemy)
  }

  return (
    <div className="retro-card border-retro-orange">
      <div className="relative mb-6">
        <h2 className="retro-heading text-xl sm:text-2xl text-center text-retro-orange">
          <Skull className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-neon-pulse" />
          ENEMIGOS
        </h2>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-transparent via-retro-orange to-transparent"></div>
      </div>

      <AddEnemyForm onAdd={handleAddEnemy} />

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {character.enemies.length === 0 ? (
          <div className="text-center text-red-400/50 font-mono py-8">No hay enemigos</div>
        ) : (
          character.enemies.map((enemy, index) => (
            <EnemyCard
              key={enemy.id}
              enemy={enemy}
              index={index}
              isRolling={rollingEnemies.has(enemy.id)}
              diceDisplay={enemyDiceDisplay[enemy.id] || null}
              onRoll={() => onEnemyRoll(enemy.id)}
              onRemove={() => removeEnemy(enemy.id)}
              onUpdateLife={(delta) =>
                updateEnemy(enemy.id, {
                  currentLife: Math.max(0, Math.min(enemy.maxLife, enemy.currentLife + delta))
                })
              }
              onUpdateBody={(delta) =>
                updateEnemy(enemy.id, { body: Math.max(0, Math.min(5, enemy.body + delta)) })
              }
              onToggleElemental={(checked) => updateEnemy(enemy.id, { useElementalDamage: checked })}
              getEnemyName={getEnemyName}
            />
          ))
        )}
      </div>
    </div>
  )
}
