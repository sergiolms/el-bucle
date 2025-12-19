import { DollarSign } from "lucide-react"
import { NumericInput } from "@/components/ui/numeric-input"

interface CreditsInputProps {
  value: number
  onChange: (value: number) => void
}

export function CreditsInput({ value, onChange }: CreditsInputProps) {
  return (
    <div className="mb-6 p-3 sm:p-4 bg-black/30 rounded-sm border-2 border-retro-green/50">
      <div className="flex items-center justify-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-retro-green animate-neon-pulse" />
        <label className="text-retro-green font-display text-xs sm:text-sm tracking-wider">CRÉDITOS</label>
      </div>
      <NumericInput
        value={value}
        onChange={onChange}
        min={0}
        placeholder="Cantidad"
        className="retro-input text-retro-green border-retro-green text-center font-bold text-lg"
      />
    </div>
  )
}
