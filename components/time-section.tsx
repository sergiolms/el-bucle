
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Minus, Plus, Calendar, Clock, RotateCcw, Save, Trash2 } from "lucide-react"
import { useState } from "react"
import { SavePointDialog } from "./save-point-dialog"

export function TimeSection() {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false)
  const [showSavePointDialog, setShowSavePointDialog] = useState(false)
  const [savePointState, setSavePointState] = useState<"idle" | "saved" | "error">("idle")
  const { character, updateCharacter, createSavePoint, resetDay, resetAll } = useCharacter()

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const handleResetDay = async () => {
    await resetDay()
    setShowResetConfirm(false)
  }

  const handleResetAll = () => {
    resetAll()
    setShowResetAllConfirm(false)
  }

  const handleCreateSavePoint = async (details: { section: string; zone: string; location: string }) => {
    const success = await createSavePoint(details)
    setSavePointState(success ? "saved" : "error")

    window.setTimeout(() => {
      setSavePointState("idle")
    }, 2500)

    return success
  }

  return (
    <div className="retro-card">
      <h2 className="text-lg sm:text-xl font-mono text-retro-purple/90 uppercase tracking-wider text-center mb-6">
        Progreso Temporal
      </h2>

      {/* Día */}
      <div className="mb-6 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-retro-purple animate-neon-pulse" />
          <label className="retro-text text-retro-purple text-xs sm:text-sm tracking-wider">DÍA</label>
        </div>
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ day: Math.max(1, character.day - 1) })}
            className="retro-button text-xs p-0 w-11 h-11 sm:w-12 sm:h-12"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <span className="text-3xl sm:text-4xl font-retro text-retro-purple min-w-[3rem] sm:min-w-[4rem] text-center"
                style={{ textShadow: '0 0 15px rgba(160, 32, 240, 1), 0 0 30px rgba(160, 32, 240, 0.5)' }}>
            {character.day}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ day: character.day + 1 })}
            className="retro-button text-xs p-0 w-11 h-11 sm:w-12 sm:h-12"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Hora */}
      <div className="p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-retro-cyan animate-neon-pulse" />
          <label className="retro-text text-xs sm:text-sm tracking-wider">HORA</label>
        </div>

        {/* Botones de hora */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ hour: Math.max(8, character.hour - 1) })}
            className="retro-button text-xs p-0 w-11 h-11 sm:w-12 sm:h-12"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <span className="text-2xl sm:text-3xl font-retro text-retro-cyan min-w-[4rem] sm:min-w-[5rem] text-center"
                style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4)' }}>
            {formatHour(character.hour)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateCharacter({ hour: Math.min(23, character.hour + 1) })}
            className="retro-button text-xs p-0 w-11 h-11 sm:w-12 sm:h-12"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Slider de hora */}
        <div className="px-2 sm:px-4">
          <Slider
            value={[character.hour]}
            onValueChange={(value) => updateCharacter({ hour: value[0] })}
            min={8}
            max={23}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-retro-cyan/70 font-mono mt-2">
            <span>08:00</span>
            <span>15:30</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-black/20 backdrop-blur-md border border-retro-green/25 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="retro-text text-retro-green text-xs sm:text-sm tracking-wider">
              SAVE POINT MANUAL
            </p>
            <p className="text-retro-cyan/70 font-mono text-[10px] sm:text-xs mt-1">
              Guarda un checkpoint en Día {character.day} a las {formatHour(character.hour)} con sección y localización explícitas
            </p>
          </div>
          <Button
            onClick={() => setShowSavePointDialog(true)}
            className="bg-gradient-to-r from-retro-green/80 to-emerald-500/70 hover:from-retro-green hover:to-emerald-400 text-white font-display text-xs sm:text-sm uppercase border-2 border-retro-green/60 shadow-[0_0_18px_rgba(60,179,113,0.35)] px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            CREAR SAVE POINT
          </Button>
        </div>
        <p className="mt-3 text-center sm:text-left text-[10px] sm:text-xs font-mono text-retro-green/80 min-h-4">
          {savePointState === "saved" ? "Checkpoint guardado en el historial." : null}
          {savePointState === "error" ? "No se pudo guardar el checkpoint." : null}
        </p>
      </div>

      <SavePointDialog
        currentSection={character.currentSection}
        isOpen={showSavePointDialog}
        onOpenChange={setShowSavePointDialog}
        onSave={handleCreateSavePoint}
      />

      {/* Botones de Reset */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-retro-pink/30 space-y-4">
        {/* Reset Diario */}
        <div className="text-center">
          <p className="retro-text text-retro-purple text-xs sm:text-sm mb-3 sm:mb-4 tracking-wider">NUEVO DÍA</p>
          {!showResetConfirm ? (
            <Button
              onClick={() => setShowResetConfirm(true)}
              className="bg-gradient-to-r from-retro-orange to-red-500 hover:from-retro-orange/80 hover:to-red-600 text-white font-display text-xs sm:text-sm uppercase border-2 border-retro-orange shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_25px_rgba(255,107,53,0.6)] px-4 sm:px-6 py-2 sm:py-3 w-full"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              RESET DIARIO
            </Button>
          ) : (
            <div className="bg-black/50 border-2 border-retro-orange rounded-sm p-3 sm:p-4">
              <p className="text-retro-orange font-display text-xs sm:text-sm mb-2">¿Confirmar reset diario?</p>
              <p className="text-retro-cyan/70 font-mono text-[10px] sm:text-xs mb-3 sm:mb-4">
                Se avanzará al día {character.day + 1}, se reiniciará la hora, se borrarán objetos/armas sin candado y
                pistas temporales. Antes se guardará un checkpoint automático del estado actual.
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button onClick={handleResetDay} className="retro-button text-xs flex-1 sm:flex-none min-w-[100px]">
                  CONFIRMAR
                </Button>
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="outline"
                  className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs flex-1 sm:flex-none min-w-[100px]"
                >
                  CANCELAR
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Completo */}
        <div className="text-center">
          <p className="text-red-400 font-display text-xs sm:text-sm mb-3 sm:mb-4 tracking-wider"
             style={{ textShadow: '0 0 5px rgba(255, 0, 0, 0.5)' }}>
            RESET COMPLETO
          </p>
          {!showResetAllConfirm ? (
            <Button
              onClick={() => setShowResetAllConfirm(true)}
              variant="outline"
              className="border-2 border-red-500 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] font-display text-xs sm:text-sm uppercase px-4 sm:px-6 py-2 sm:py-3 w-full"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              BORRAR TODO
            </Button>
          ) : (
            <div className="bg-black/50 border-2 border-red-500 rounded-sm p-3 sm:p-4">
              <p className="text-red-400 font-display text-xs sm:text-sm mb-2">⚠️ ¿BORRAR TODA LA FICHA?</p>
              <p className="text-red-300/70 font-mono text-[10px] sm:text-xs mb-3 sm:mb-4">
                Se perderán TODOS los datos excepto las notas de investigación
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button onClick={handleResetAll} className="bg-red-600 hover:bg-red-700 text-white font-display text-xs border-2 border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)] flex-1 sm:flex-none min-w-[120px]">
                  SÍ, BORRAR TODO
                </Button>
                <Button
                  onClick={() => setShowResetAllConfirm(false)}
                  variant="outline"
                  className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs flex-1 sm:flex-none min-w-[100px]"
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
