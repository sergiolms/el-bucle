import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface AttributeCounterProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  color?: string
}

export function AttributeCounter({
  label,
  value,
  onChange,
  min = 0,
  max = 5,
  color = "text-retro-cyan"
}: AttributeCounterProps) {
  return (
    <div className="text-center">
      <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider">{label}</label>
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
        >
          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <span
          className={`text-2xl sm:text-3xl font-retro ${color} w-10 sm:w-12 text-center`}
          style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4)' }}
        >
          {value}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  )
}
