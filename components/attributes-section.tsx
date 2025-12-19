import { useCharacter } from "./character-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AttributeCounter } from "@/components/ui/attribute-counter"
import { DecisionDice } from "./attributes/decision-dice"
import { BookOpen } from "lucide-react"

export function AttributesSection() {
  const { character, updateCharacter } = useCharacter()

  const statusColors = {
    sano: "text-green-400",
    herido: "text-yellow-400",
    grave: "text-orange-400",
    muerto: "text-red-400",
  }

  const statusLabels = {
    sano: "SANO",
    herido: "HERIDO",
    grave: "GRAVE",
    muerto: "MUERTO",
  }

  return (
    <div className="retro-card">
      <h2 className="text-lg sm:text-xl font-mono text-retro-pink/90 uppercase tracking-wider text-center mb-6">
        Atributos
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
        <AttributeCounter
          label="CUERPO"
          value={character.body}
          onChange={(val) => updateCharacter({ body: val })}
        />
        <AttributeCounter
          label="MENTE"
          value={character.mind}
          onChange={(val) => updateCharacter({ mind: val })}
        />
        <AttributeCounter
          label="GESTA"
          value={character.gesta}
          onChange={(val) => updateCharacter({ gesta: val })}
          max={999}
        />

        <div className="text-center">
          <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider">ESTADO</label>
          <Select
            value={character.status}
            onValueChange={(value: "sano" | "herido" | "grave" | "muerto") =>
              updateCharacter({ status: value })
            }
          >
            <SelectTrigger className="retro-input border-retro-cyan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-2 border-retro-cyan">
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value} className={`font-mono ${statusColors[value as keyof typeof statusColors]}`}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          SECCIÓN ACTUAL
        </label>
        <Input
          value={character.currentSection}
          onChange={(e) => updateCharacter({ currentSection: e.target.value })}
          placeholder="Ej: 1, 42, 103..."
          className="retro-input text-retro-cyan border-retro-cyan text-center font-bold text-lg"
        />
      </div>

      <DecisionDice />
    </div>
  )
}
