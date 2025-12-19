import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flame, Snowflake, Zap } from "lucide-react"
import type { ElementalType } from "@/lib/elemental-utils"

interface ElementalSelectorProps {
  value: ElementalType
  onChange: (value: ElementalType) => void
  className?: string
}

export function ElementalSelector({ value, onChange, className }: ElementalSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-black/20 backdrop-blur-xl border-yellow-400">
        <SelectItem value="none" className="text-yellow-100 font-mono">
          Sin elemento
        </SelectItem>
        <SelectItem value="fire" className="text-red-400 font-mono">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Fuego
          </div>
        </SelectItem>
        <SelectItem value="ice" className="text-blue-400 font-mono">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            Hielo
          </div>
        </SelectItem>
        <SelectItem value="thunder" className="text-yellow-400 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Rayo
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
