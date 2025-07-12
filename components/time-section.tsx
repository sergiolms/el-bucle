
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Calendar, Clock, RotateCcw, Trash2 } from "lucide-react"
import { useState } from "react"

export function TimeSection() {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false)
  const { character, updateCharacter, resetDay, resetAll } = useCharacter()

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const handleResetDay = () => {
    resetDay()
    setShowResetConfirm(false)
  }

  const handleResetAll = () => {
    resetAll()
    setShowResetAllConfirm(false)
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

      {/* Botones de Reset */}
      <div className="mt-8 pt-6 border-t border-purple-400/20 space-y-4">
        {/* Reset Diario */}
        <div className="text-center">
          <p className="text-purple-300 font-mono text-sm mb-4">NUEVO DÍA</p>
          {!showResetConfirm ? (
            <Button
              onClick={() => setShowResetConfirm(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-mono font-bold px-6 py-3 w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              RESET DIARIO
            </Button>
          ) : (
            <div className="bg-gray-900/50 border border-red-400/30 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm mb-2">¿Confirmar reset diario?</p>
              <p className="text-red-300/70 font-mono text-xs mb-4">
                Se avanzará al día {character.day + 1}, se reiniciará la hora, se borrarán objetos/armas sin candado y
                pistas temporales
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleResetDay} className="bg-red-500 hover:bg-red-600 text-white font-mono font-bold">
                  CONFIRMAR
                </Button>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="outline"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400/20 font-mono"
                >
                  CANCELAR
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Completo */}
        <div className="text-center">
          <p className="text-red-300 font-mono text-sm mb-4">RESET COMPLETO</p>
          {!showResetAllConfirm ? (
            <Button
              onClick={() => setShowResetAllConfirm(true)}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/20 font-mono font-bold px-6 py-3 w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              BORRAR TODO
            </Button>
          ) : (
            <div className="bg-gray-900/50 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-mono text-sm mb-2">⚠️ ¿BORRAR TODA LA FICHA?</p>
              <p className="text-red-300/70 font-mono text-xs mb-4">
                Se perderán TODOS los datos excepto las notas de investigación
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleResetAll} className="bg-red-600 hover:bg-red-700 text-white font-mono font-bold">
                  SÍ, BORRAR TODO
                </Button>
                <Button
                  onClick={() => setShowResetAllConfirm(false)}
                  variant="outline"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400/20 font-mono"
                >
                  CANCELAR
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
