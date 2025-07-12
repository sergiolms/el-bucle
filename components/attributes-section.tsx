
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input" // Import Input component
import { Minus, Plus, BookOpen } from "lucide-react" // Import BookOpen icon

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
    <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-mono font-bold text-pink-400 mb-6 text-center">ATRIBUTOS</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Cuerpo */}
        <div className="text-center">
          <label className="block text-cyan-400 font-mono text-sm mb-2">CUERPO</label>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ body: Math.max(0, character.body - 1) })}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 w-8 h-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-3xl font-mono font-bold text-cyan-400 w-12 text-center">{character.body}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ body: Math.min(5, character.body + 1) })}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mente */}
        <div className="text-center">
          <label className="block text-cyan-400 font-mono text-sm mb-2">MENTE</label>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ mind: Math.max(0, character.mind - 1) })}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 w-8 h-8 p-0"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-3xl font-mono font-bold text-cyan-400 w-12 text-center">{character.mind}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ mind: Math.min(5, character.mind + 1) })}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gesta */}
      <div className="text-center mb-6">
        <label className="block text-yellow-400 font-mono text-sm mb-2">GESTA</label>
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ gesta: character.gesta - 1 })}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-4xl font-mono font-bold text-yellow-400 min-w-[3rem] text-center">
            {character.gesta}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ gesta: character.gesta + 1 })}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Estado */}
      <div className="text-center mb-6">
        <label className="block text-pink-400 font-mono text-sm mb-2">ESTADO</label>
        <Select value={character.status} onValueChange={(value: any) => updateCharacter({ status: value })}>
          <SelectTrigger
            className={`w-full border-pink-400 bg-gray-900/50 ${statusColors[character.status]} font-mono font-bold text-center`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-pink-400">
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className={`${statusColors[value as keyof typeof statusColors]} font-mono font-bold hover:bg-gray-800`}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sección Actual */}
      <div className="text-center mt-6 pt-6 border-t border-pink-400/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-pink-400" />
          <label className="text-pink-400 font-mono text-lg">SECCIÓN ACTUAL</label>
        </div>
        <Input
          value={character.currentSection}
          onChange={(e) => updateCharacter({ currentSection: e.target.value })}
          placeholder="Ej: Capítulo 3, Sección 12"
          className="bg-gray-900/50 border-pink-400 text-pink-100 placeholder-pink-400/50 font-mono text-center"
        />
      </div>
    </div>
  )
}
