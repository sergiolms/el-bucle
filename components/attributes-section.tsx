
import { useState } from "react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Minus, Plus, BookOpen, Dices } from "lucide-react"

export function AttributesSection() {
  const { character, updateCharacter } = useCharacter()
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollDice = () => {
    setIsRolling(true)
    setDiceResult(null)

    // Simulate rolling animation
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
        {/* Cuerpo */}
        <div className="text-center">
          <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider">CUERPO</label>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ body: Math.max(0, character.body - 1) })}
              className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <span className="text-2xl sm:text-3xl font-retro text-retro-cyan w-10 sm:w-12 text-center"
                  style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4)' }}>
              {character.body}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ body: Math.min(5, character.body + 1) })}
              className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Mente */}
        <div className="text-center">
          <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider">MENTE</label>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ mind: Math.max(0, character.mind - 1) })}
              className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <span className="text-2xl sm:text-3xl font-retro text-retro-cyan w-10 sm:w-12 text-center"
                  style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4)' }}>
              {character.mind}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCharacter({ mind: Math.min(5, character.mind + 1) })}
              className="retro-button text-xs p-0 w-7 h-7 sm:w-8 sm:h-8"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Gesta */}
      <div className="text-center mb-6 p-4 bg-black/30 border-2 border-retro-yellow/50 rounded-sm">
        <label className="block text-retro-yellow font-display text-xs sm:text-sm mb-3 tracking-wider"
               style={{ textShadow: '0 0 5px rgba(255, 255, 0, 0.5)' }}>
          GESTA
        </label>
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ gesta: character.gesta - 1 })}
            className="bg-gradient-to-r from-retro-yellow to-retro-orange text-black font-display border-2 border-retro-yellow shadow-[0_0_15px_rgba(255,255,0,0.4)] hover:shadow-[0_0_25px_rgba(255,255,0,0.6)] hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm px-3 sm:px-4"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <span className="text-3xl sm:text-4xl font-retro text-retro-yellow min-w-[3rem] sm:min-w-[4rem] text-center"
                style={{ textShadow: '0 0 15px rgba(255, 255, 0, 1), 0 0 30px rgba(255, 255, 0, 0.5)' }}>
            {character.gesta}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ gesta: character.gesta + 1 })}
            className="bg-gradient-to-r from-retro-yellow to-retro-orange text-black font-display border-2 border-retro-yellow shadow-[0_0_15px_rgba(255,255,0,0.4)] hover:shadow-[0_0_25px_rgba(255,255,0,0.6)] hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm px-3 sm:px-4"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Estado */}
      <div className="text-center mb-6">
        <label className="block retro-text text-xs sm:text-sm mb-2 tracking-wider">ESTADO</label>
        <Select value={character.status} onValueChange={(value: any) => updateCharacter({ status: value })}>
          <SelectTrigger
            className={`retro-input w-full ${statusColors[character.status]} font-display text-xs sm:text-sm text-center uppercase`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black border-2 border-retro-purple">
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className={`${statusColors[value as keyof typeof statusColors]} font-display hover:bg-retro-purple/20 text-xs sm:text-sm`}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sección Actual */}
      <div className="text-center mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-retro-pink" />
          <label className="text-retro-pink font-mono text-xs sm:text-sm tracking-wider uppercase">Sección Actual</label>
        </div>
        <Input
          value={character.currentSection}
          onChange={(e) => updateCharacter({ currentSection: e.target.value })}
          placeholder="Ej: Capítulo 3, Sección 12"
          className="retro-input text-center text-xs sm:text-sm placeholder-retro-pink/40"
        />
      </div>

      {/* Dado D6 para decisiones */}
      <div className="text-center mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Dices className="w-4 h-4 sm:w-5 sm:h-5 text-retro-purple" />
          <label className="text-retro-purple font-mono text-xs sm:text-sm tracking-wider uppercase">Dado de Decisión</label>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Dice display */}
          <div className="relative">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ${isRolling ? 'animate-bounce' : ''}`}>
              {diceResult !== null ? (
                <span className="text-4xl sm:text-5xl font-bold font-retro text-retro-purple"
                      style={{ textShadow: '0 0 20px rgba(139, 71, 137, 0.6)' }}>
                  {diceResult}
                </span>
              ) : (
                <Dices className="w-10 h-10 sm:w-12 sm:h-12 text-retro-purple/50" />
              )}
            </div>
            {/* Glow effect when rolling */}
            {isRolling && (
              <div className="absolute inset-0 rounded-2xl bg-retro-purple/20 animate-ping"></div>
            )}
          </div>

          {/* Roll button */}
          <Button
            onClick={rollDice}
            disabled={isRolling}
            className="retro-button text-xs sm:text-sm px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRolling ? 'Lanzando...' : 'Lanzar Dado'}
          </Button>

          {diceResult !== null && !isRolling && (
            <p className="text-xs text-retro-purple/70 font-mono">
              Resultado: {diceResult}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
