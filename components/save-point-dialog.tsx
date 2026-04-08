import { useEffect, useState } from "react"
import { MapPinned, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TANIS_MAP_ZONES } from "@/src/features/history/map-reference"

interface SavePointDialogProps {
  currentSection: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (details: { section: string; zone: string; location: string }) => Promise<boolean>
}

export function SavePointDialog({
  currentSection,
  isOpen,
  onOpenChange,
  onSave,
}: SavePointDialogProps) {
  const [section, setSection] = useState(currentSection)
  const [location, setLocation] = useState("")
  const [zone, setZone] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const selectedLocationValue = zone && location ? `${zone}:::${location}` : ""

  useEffect(() => {
    if (isOpen) {
      setSection(currentSection)
      setLocation("")
      setZone("")
      setErrorMessage("")
      setIsSaving(false)
    }
  }, [currentSection, isOpen])

  const handleSave = async () => {
    if (!section.trim()) {
      setErrorMessage("Indica la sección exacta antes de guardar el checkpoint.")
      return
    }

    if (!location) {
      setErrorMessage("Selecciona la localización en Tanis antes de guardar.")
      return
    }

    setIsSaving(true)
    setErrorMessage("")
    const success = await onSave({
      section: section.trim(),
      zone,
      location,
    })
    setIsSaving(false)

    if (success) {
      onOpenChange(false)
      return
    }

    setErrorMessage("No se pudo crear el checkpoint.")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-black border-2 border-retro-green/40 text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-retro-green uppercase tracking-wider">
            Crear Save Point
          </DialogTitle>
          <DialogDescription className="font-mono text-xs sm:text-sm text-retro-cyan/70">
            {currentSection.trim()
              ? "Confirma o corrige la sección actual antes de guardar el checkpoint."
              : "Indica la sección exacta en la que estabas antes de guardar el checkpoint."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-retro-green mb-2">
              Sección exacta
            </label>
            <Input
              value={section}
              onChange={(event) => setSection(event.target.value)}
              placeholder="Ej: 42, 103, 211..."
              className="retro-input text-retro-cyan border-retro-green/40 text-center font-bold text-lg"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-retro-green mb-2">
              Dónde estabas en Tanis
            </label>
            <Select
              value={selectedLocationValue}
              onValueChange={(value) => {
                const [nextZone, nextLocation] = value.split(":::")
                setZone(nextZone ?? "")
                setLocation(nextLocation ?? "")
              }}
            >
              <SelectTrigger className="retro-input border-retro-green/40 text-retro-cyan font-mono">
                <SelectValue placeholder="Selecciona una localización del mapa" />
              </SelectTrigger>
              <SelectContent className="bg-black border-2 border-retro-green/40 text-retro-cyan max-h-80">
                {TANIS_MAP_ZONES.map((group, groupIndex) => (
                  <div key={group.zone}>
                    <SelectLabel className="font-display tracking-wider text-retro-green">
                      {group.zone}
                    </SelectLabel>
                    {group.places.map((mapLocation) => (
                      <SelectItem
                        key={`${group.zone}-${mapLocation}`}
                        value={`${group.zone}:::${mapLocation}`}
                        className="font-mono"
                      >
                        {mapLocation}
                      </SelectItem>
                    ))}
                    {groupIndex < TANIS_MAP_ZONES.length - 1 ? <SelectSeparator /> : null}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-retro-green/25 bg-black/20 p-3 font-mono text-[11px] sm:text-xs text-retro-cyan/70 flex items-start gap-2">
            <MapPinned className="w-4 h-4 text-retro-green mt-0.5 flex-shrink-0" />
            <span>
              Usa la pestaña Historial para consultar el mapa completo de Tanis mientras eliges la localización.
            </span>
          </div>

          {errorMessage ? (
            <p className="font-mono text-xs text-red-300">{errorMessage}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-retro-green/80 to-emerald-500/70 hover:from-retro-green hover:to-emerald-400 text-white font-display text-xs uppercase border-2 border-retro-green/60"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar checkpoint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
