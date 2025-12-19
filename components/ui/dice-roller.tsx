import { Dice6 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DiceRollerProps {
  value: number | null
  displayValue: number | null
  isRolling: boolean
  onRoll: () => void
  color: 'green' | 'orange'
  size?: 'small' | 'large'
  disabled?: boolean
}

const colorClasses = {
  green: {
    bg: 'from-retro-green/20 to-retro-green/5',
    border: 'border-retro-green/40',
    shadow: 'shadow-[0_8px_32px_rgba(60,179,113,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    text: 'text-retro-green',
    textShadow: '0 0 20px rgba(60, 179, 113, 0.8), 0 0 40px rgba(60, 179, 113, 0.4)',
    ping: 'bg-retro-green/30',
    button: 'from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)]'
  },
  orange: {
    bg: 'from-retro-orange/20 to-red-500/10',
    border: 'border-retro-orange/40',
    shadow: 'shadow-[0_4px_16px_rgba(205,92,92,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
    text: 'text-retro-orange',
    textShadow: '0 0 15px rgba(205, 92, 92, 0.8), 0 0 30px rgba(205, 92, 92, 0.4)',
    ping: 'bg-retro-orange/30',
    button: 'from-retro-orange/50 to-red-500/40 hover:from-retro-orange/60 hover:to-red-500/50 border-retro-orange/60 shadow-[0_4px_16px_rgba(205,92,92,0.3)] hover:shadow-[0_6px_24px_rgba(205,92,92,0.5)]'
  }
}

const sizeClasses = {
  small: {
    dice: 'w-16 h-16 sm:w-20 sm:h-20 rounded-xl',
    text: 'text-3xl sm:text-4xl',
    icon: 'w-8 h-8 sm:w-10 sm:h-10',
    button: 'text-sm px-4 py-2 rounded-lg'
  },
  large: {
    dice: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl',
    text: 'text-5xl sm:text-6xl',
    icon: 'w-12 h-12 sm:w-14 sm:h-14',
    button: 'text-lg px-8 py-4 rounded-xl'
  }
}

export function DiceRoller({
  value,
  displayValue,
  isRolling,
  onRoll,
  color,
  size = 'large',
  disabled = false
}: DiceRollerProps) {
  const colors = colorClasses[color]
  const sizes = sizeClasses[size]
  const currentValue = isRolling ? displayValue : value

  return (
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className={`${sizes.dice} bg-gradient-to-br ${colors.bg} backdrop-blur-md border-2 ${colors.border} flex items-center justify-center ${colors.shadow} transition-all duration-300 ${isRolling ? 'animate-bounce scale-110' : ''}`}>
            {currentValue !== null ? (
              <span
                className={`${sizes.text} font-bold font-retro ${colors.text}`}
                style={{ textShadow: colors.textShadow }}
              >
                {currentValue}
              </span>
            ) : (
              <Dice6 className={`${sizes.icon} ${colors.text}/50`} />
            )}
          </div>
          {isRolling && (
            <div className={`absolute inset-0 ${sizes.dice} ${colors.ping} animate-ping`}></div>
          )}
        </div>
      </div>

      <Button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`bg-gradient-to-br ${colors.button} text-white font-mono font-bold ${sizes.button} border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md w-full`}
      >
        <Dice6 className={size === 'large' ? 'w-6 h-6 mr-2' : 'w-4 h-4 mr-1'} />
        {isRolling ? 'LANZANDO...' : 'TIRAR'}
      </Button>
    </div>
  )
}
