import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dices, Dice6 } from "lucide-react"

export function DecisionDice() {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    setDiceResult(null)

    let rolls = 0
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(interval)
        const finalResult = Math.floor(Math.random() * 6) + 1
        setDiceResult(finalResult)
        setIsRolling(false)
      }
    }, 100)
  }

  return (
    <div className="p-4 sm:p-6 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-retro-purple" />
          <h3 className="text-base sm:text-lg font-mono text-retro-purple/90 uppercase tracking-wider">
            Dado de Decisión
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center ${isRolling ? 'animate-bounce' : ''}`}
          >
            {diceResult !== null ? (
              <span className="text-4xl sm:text-5xl font-bold font-retro text-retro-purple">
                {diceResult}
              </span>
            ) : (
              <Dice6 className="w-10 h-10 text-retro-purple/50" />
            )}
          </div>

          <Button
            onClick={rollDice}
            disabled={isRolling}
            className="bg-gradient-to-br from-retro-purple/50 to-retro-purple/30 hover:from-retro-purple/60 hover:to-retro-purple/40 text-white font-mono font-bold px-6 py-2 text-sm border-2 border-retro-purple/60 shadow-[0_4px_16px_rgba(160,32,240,0.3)] hover:shadow-[0_6px_24px_rgba(160,32,240,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-lg"
          >
            <Dice6 className="w-4 h-4 mr-2" />
            {isRolling ? 'Lanzando...' : 'Tirar Dado'}
          </Button>
        </div>
      </div>
    </div>
  )
}
