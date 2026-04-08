import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronUp, MapPinned, Save } from "lucide-react"
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
  const [locationQuery, setLocationQuery] = useState("")
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSection(currentSection)
      setLocation("")
      setZone("")
      setLocationQuery("")
      setIsLocationOpen(false)
      setErrorMessage("")
      setIsSaving(false)
    }
  }, [currentSection, isOpen])

  const filteredZones = useMemo(() => {
    const normalizedQuery = locationQuery.trim().toLocaleLowerCase()

    if (!normalizedQuery) {
      return TANIS_MAP_ZONES
    }

    return TANIS_MAP_ZONES
      .map((group) => ({
        ...group,
        places: group.places.filter((place) => {
          const haystack = `${group.zone} ${place}`.toLocaleLowerCase()
          return haystack.includes(normalizedQuery)
        }),
      }))
      .filter((group) => group.places.length > 0)
  }, [locationQuery])

  const handleSelectLocation = (nextZone: string, nextLocation: string) => {
    setZone(nextZone)
    setLocation(nextLocation)
    setLocationQuery(nextLocation)
    setIsLocationOpen(false)
    setErrorMessage("")
  }

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
            <button
              type="button"
              onClick={() => setIsLocationOpen((current) => !current)}
              className="retro-input border-retro-green/40 text-retro-cyan font-mono w-full h-10 px-3 py-2 text-sm flex items-center justify-between gap-3"
            >
              <span className={`truncate text-left ${location ? "text-retro-cyan" : "text-retro-cyan/50"}`}>
                {location ? `${zone} · ${location}` : "Selecciona una localización"}
              </span>
              {isLocationOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
            </button>

            {isLocationOpen ? (
              <div className="mt-2 rounded-xl border border-retro-green/25 bg-black/20">
                <div className="p-2 border-b border-white/10">
                  <Input
                    autoFocus
                    value={locationQuery}
                    onChange={(event) => {
                      setLocationQuery(event.target.value)
                      if (location && event.target.value.trim() !== location) {
                        setLocation("")
                        setZone("")
                      }
                    }}
                    placeholder="Escribe para filtrar"
                    className="retro-input h-9 px-3 py-1.5 text-xs sm:text-sm border-retro-green/30 text-retro-cyan font-mono"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {filteredZones.length ? (
                    <div className="p-2 space-y-2">
                      {filteredZones.map((group) => (
                        <div key={group.zone}>
                          <p className="px-2 py-1 font-display text-[11px] sm:text-xs tracking-wider text-retro-green uppercase">
                            {group.zone}
                          </p>
                          <div className="space-y-1">
                            {group.places.map((mapLocation) => {
                              const isSelected = zone === group.zone && location === mapLocation

                              return (
                                <button
                                  key={`${group.zone}-${mapLocation}`}
                                  type="button"
                                  onClick={() => handleSelectLocation(group.zone, mapLocation)}
                                  className={`w-full text-left rounded-lg px-3 py-2 font-mono text-xs sm:text-sm transition-colors ${
                                    isSelected
                                      ? "bg-retro-green/20 text-retro-green border border-retro-green/40"
                                      : "bg-transparent text-retro-cyan hover:bg-white/5 border border-transparent"
                                  }`}
                                >
                                  <span className="block">{mapLocation}</span>
                                  <span className="block text-[10px] sm:text-xs text-retro-cyan/50">
                                    {group.zone}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-4 font-mono text-xs text-retro-cyan/60">
                      No hay resultados para esa búsqueda.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {location ? (
              <p className="mt-2 font-mono text-[10px] sm:text-xs text-retro-green/80">
                Seleccionado: {zone} · {location}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-retro-green/25 bg-black/20 p-3 font-mono text-[11px] sm:text-xs text-retro-cyan/70 flex items-start gap-2">
            <MapPinned className="w-4 h-4 text-retro-green mt-0.5 flex-shrink-0" />
            <span>
              Puedes consultar el mapa de Tanis justo debajo del campo de sección actual.
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
