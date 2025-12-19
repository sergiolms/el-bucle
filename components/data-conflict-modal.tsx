import { CharacterData } from "./character-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Cloud, HardDrive, AlertTriangle } from "lucide-react"

interface DataConflictModalProps {
  isOpen: boolean
  localData: CharacterData | null
  cloudData: CharacterData
  onSelectLocal: () => void
  onSelectCloud: () => void
}

export function DataConflictModal({
  isOpen,
  localData,
  cloudData,
  onSelectLocal,
  onSelectCloud,
}: DataConflictModalProps) {
  const getItemsSummary = (data: CharacterData) => {
    const totalItems = data.items.length
    const totalWeapons = data.weapons.length
    if (totalItems === 0 && totalWeapons === 0) return "Sin objetos ni armas"
    const parts = []
    if (totalWeapons > 0) parts.push(`${totalWeapons} arma${totalWeapons > 1 ? 's' : ''}`)
    if (totalItems > 0) parts.push(`${totalItems} objeto${totalItems > 1 ? 's' : ''}`)
    return parts.join(', ')
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sano: "Sano",
      herido: "Herido",
      grave: "Grave",
      muerto: "Muerto"
    }
    return labels[status] || status
  }

  const DataSummary = ({ data, icon: Icon, title, iconColor }: {
    data: CharacterData,
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    iconColor: string
  }) => (
    <div className="flex-1 p-4 rounded-lg border-2 transition-all hover:border-cyan-400/50 bg-black/20">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-mono font-bold text-cyan-100">{title}</h3>
      </div>

      <div className="space-y-2 text-sm font-mono">
        <div className="flex justify-between">
          <span className="text-cyan-400/70">Cuerpo:</span>
          <span className="text-cyan-100">{data.body}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-400/70">Mente:</span>
          <span className="text-cyan-100">{data.mind}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-400/70">Gesta:</span>
          <span className="text-cyan-100">{data.gesta}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-400/70">Estado:</span>
          <span className={`${
            data.status === 'sano' ? 'text-green-400' :
            data.status === 'herido' ? 'text-yellow-400' :
            data.status === 'grave' ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {getStatusLabel(data.status)}
          </span>
        </div>
        <div className="border-t border-cyan-400/20 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-cyan-400/70">Día:</span>
            <span className="text-cyan-100">{data.day}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/70">Hora:</span>
            <span className="text-cyan-100">{data.hour}:00</span>
          </div>
        </div>
        <div className="border-t border-cyan-400/20 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-cyan-400/70">Inventario:</span>
            <span className="text-cyan-100 text-xs">{getItemsSummary(data)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/70">Pistas:</span>
            <span className="text-cyan-100">{data.clues.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400/70">Créditos:</span>
            <span className="text-cyan-100">{data.credits}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-black via-retro-darkBlue to-black border-2 border-cyan-400/50 text-cyan-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400 animate-pulse" />
            <DialogTitle className="font-mono text-2xl text-cyan-400">
              CONFLICTO DE DATOS DETECTADO
            </DialogTitle>
          </div>
          <DialogDescription className="font-mono text-cyan-400/70">
            Se han encontrado datos diferentes en tu dispositivo local y en la nube.
            Selecciona qué datos quieres conservar:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 my-6">
          {localData && (
            <DataSummary
              data={localData}
              icon={HardDrive}
              title="DATOS LOCALES"
              iconColor="text-retro-purple"
            />
          )}

          <DataSummary
            data={cloudData}
            icon={Cloud}
            title="DATOS EN LA NUBE"
            iconColor="text-retro-green animate-pulse"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {localData && (
            <Button
              onClick={onSelectLocal}
              className="flex-1 bg-gradient-to-br from-retro-purple/50 to-retro-purple/30 hover:from-retro-purple/60 hover:to-retro-purple/40 text-white font-mono border-2 border-retro-purple/60 shadow-[0_4px_20px_rgba(138,43,226,0.3)] hover:shadow-[0_6px_30px_rgba(138,43,226,0.5)] transition-all"
            >
              <HardDrive className="w-4 h-4 mr-2" />
              Usar datos locales
            </Button>
          )}

          <Button
            onClick={onSelectCloud}
            className="flex-1 bg-gradient-to-br from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 text-white font-mono border-2 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)] transition-all"
          >
            <Cloud className="w-4 h-4 mr-2" />
            Usar datos de la nube
          </Button>
        </div>

        <p className="text-xs text-cyan-400/50 font-mono text-center mt-4">
          ⚠️ El dato que no selecciones será sobrescrito permanentemente
        </p>
      </DialogContent>
    </Dialog>
  )
}
