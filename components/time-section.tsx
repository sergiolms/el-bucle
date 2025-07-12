"use client"

import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Calendar, Clock } from "lucide-react"

export function TimeSection() {
  const { character, updateCharacter } = useCharacter()

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  return (
    <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-mono font-bold text-purple-400 mb-6 text-center">PROGRESO TEMPORAL</h2>

      {/* Día */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <label className="text-purple-400 font-mono text-lg">DÍA</label>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ day: Math.max(1, character.day - 1) })}
            className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-4xl font-mono font-bold text-purple-400 min-w-[4rem] text-center">{character.day}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ day: character.day + 1 })}
            className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hora */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          <label className="text-cyan-400 font-mono text-lg">HORA</label>
        </div>

        {/* Botones de hora */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ hour: Math.max(8, character.hour - 1) })}
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-3xl font-mono font-bold text-cyan-400 min-w-[5rem] text-center">
            {formatHour(character.hour)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ hour: Math.min(23, character.hour + 1) })}
            className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Slider de hora */}
        <div className="px-4">
          <Slider
            value={[character.hour]}
            onValueChange={(value) => updateCharacter({ hour: value[0] })}
            min={8}
            max={23}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-cyan-400/70 font-mono mt-2">
            <span>08:00</span>
            <span>15:30</span>
            <span>23:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}
