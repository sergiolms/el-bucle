import { useState } from "react"
import { useCharacter } from "./character-context"
import { PlayerPanel } from "./combat/player-panel"
import { EnemiesPanel } from "./combat/enemies-panel"

export function CombatSection() {
  const { rollPlayerDice, rollEnemyDice } = useCharacter()

  // Player dice animation
  const [isPlayerRolling, setIsPlayerRolling] = useState(false)
  const [playerDiceDisplay, setPlayerDiceDisplay] = useState<number | null>(null)

  // Enemy dice animation
  const [rollingEnemies, setRollingEnemies] = useState<Set<string>>(new Set())
  const [enemyDiceDisplay, setEnemyDiceDisplay] = useState<Record<string, number>>({})

  const handlePlayerRoll = () => {
    setIsPlayerRolling(true)
    setPlayerDiceDisplay(null)

    let rolls = 0
    const interval = setInterval(() => {
      setPlayerDiceDisplay(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 12) {
        clearInterval(interval)
        rollPlayerDice()
        setIsPlayerRolling(false)
      }
    }, 100)
  }

  const handleEnemyRoll = (enemyId: string) => {
    setRollingEnemies(prev => new Set(prev).add(enemyId))
    setEnemyDiceDisplay(prev => ({ ...prev, [enemyId]: 0 }))

    let rolls = 0
    const interval = setInterval(() => {
      setEnemyDiceDisplay(prev => ({ ...prev, [enemyId]: Math.floor(Math.random() * 6) + 1 }))
      rolls++
      if (rolls >= 12) {
        clearInterval(interval)
        rollEnemyDice(enemyId)
        setRollingEnemies(prev => {
          const newSet = new Set(prev)
          newSet.delete(enemyId)
          return newSet
        })
      }
    }, 100)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <PlayerPanel
        isRolling={isPlayerRolling}
        diceDisplay={playerDiceDisplay}
        onRoll={handlePlayerRoll}
      />
      <EnemiesPanel
        rollingEnemies={rollingEnemies}
        enemyDiceDisplay={enemyDiceDisplay}
        onEnemyRoll={handleEnemyRoll}
      />
    </div>
  )
}
