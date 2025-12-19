import { useState } from "react"
import { Dices } from "lucide-react"
import { DiceRoller } from "@/components/ui/dice-roller"

export function DecisionDice() {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [diceDisplay, setDiceDisplay] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    setDiceDisplay(null)

    let rolls = 0
    const interval = setInterval(() => {
      setDiceDisplay(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(interval)
        const finalResult = Math.floor(Math.random() * 6) + 1
        setDiceResult(finalResult)
        setDiceDisplay(finalResult)
        setIsRolling(false)
      }
    }, 100)
  }

  return (
    <div className="p-4 sm:p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Dices className="w-5 h-5 text-retro-purple" />
          <h3 className="text-base sm:text-lg font-mono text-retro-purple/90 uppercase tracking-wider">
            Dado de Decisión
          </h3>
        </div>

        <DiceRoller
          value={diceResult}
          displayValue={diceDisplay}
          isRolling={isRolling}
          onRoll={rollDice}
          color="purple"
          size="small"
        />
      </div>
    </div>
  )
}
