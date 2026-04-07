import { CharacterData } from "./character-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Cloud, HardDrive, AlertTriangle, Download } from "lucide-react"

const fieldLabels: Record<string, string> = {
  body: 'Cuerpo',
  mind: 'Mente',
  gesta: 'Gesta',
  status: 'Estado',
  items: 'Objetos',
  weapons: 'Armas',
  credits: 'Créditos',
  clues: 'Pistas',
  day: 'Día',
  hour: 'Hora',
  notes: 'Notas',
  enemies: 'Enemigos',
  selectedWeaponId: 'Arma seleccionada',
  lastPlayerRoll: 'Última tirada',
  useElementalDamage: 'Daño elemental',
  currentSection: 'Sección actual'
}

function formatFieldValue(data: CharacterData, field: string): string {
  const value = data[field as keyof CharacterData]

  switch (field) {
    case 'status': {
      const labels: Record<string, string> = { sano: 'Sano', herido: 'Herido', grave: 'Grave', muerto: 'Muerto' }
      return labels[value as string] || String(value)
    }
    case 'hour':
      return `${value}:00`
    case 'items':
      return (value as CharacterData['items']).length === 0
        ? 'Ninguno'
        : (value as CharacterData['items']).map(i => i.name).join(', ')
    case 'weapons':
      return (value as CharacterData['weapons']).length === 0
        ? 'Ninguna'
        : (value as CharacterData['weapons']).map(w => w.name).join(', ')
    case 'clues':
      return (value as CharacterData['clues']).length === 0
        ? 'Ninguna'
        : `${(value as CharacterData['clues']).length} pista${(value as CharacterData['clues']).length > 1 ? 's' : ''}`
    case 'notes':
      return (value as CharacterData['notes']).length === 0
        ? 'Ninguna'
        : `${(value as CharacterData['notes']).length} nota${(value as CharacterData['notes']).length > 1 ? 's' : ''}`
    case 'enemies':
      return (value as CharacterData['enemies']).length === 0
        ? 'Ninguno'
        : `${(value as CharacterData['enemies']).length} enemigo${(value as CharacterData['enemies']).length > 1 ? 's' : ''}`
    case 'useElementalDamage':
      return value ? 'Sí' : 'No'
    case 'selectedWeaponId': {
      if (!value) return 'Ninguna'
      const weapon = data.weapons.find(w => w.id === value)
      return weapon ? weapon.name : String(value)
    }
    case 'lastPlayerRoll':
      return value === null ? '-' : String(value)
    case 'currentSection':
      return value ? String(value) : '-'
    default:
      return String(value ?? '-')
  }
}

interface DataConflictModalProps {
  isOpen: boolean
  conflictType?: 'cloud-recovery' | 'data-mismatch'
  localData: CharacterData | null
  cloudData: CharacterData
  localTimestamp?: number
  cloudTimestamp?: string
  changedFields?: string[]
  onSelectLocal: () => void
  onSelectCloud: () => void
}

export function DataConflictModal({
  isOpen,
  conflictType,
  localData,
  cloudData,
  localTimestamp,
  cloudTimestamp,
  changedFields,
  onSelectLocal,
  onSelectCloud,
}: DataConflictModalProps) {
  const isCloudRecovery = conflictType === 'cloud-recovery'

  const isChanged = (field: string) => changedFields?.includes(field)

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

  const formatTimestamp = (ts: number | string) => {
    const date = typeof ts === 'string' ? new Date(ts) : new Date(ts)
    return date.toLocaleString()
  }

  const highlightClass = (field: string) =>
    isChanged(field) ? 'bg-yellow-400/10 border-l-2 border-yellow-400 pl-2 -ml-2 rounded' : ''

  const DataSummary = ({ data, icon: Icon, title, iconColor, timestamp }: {
    data: CharacterData,
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    iconColor: string,
    timestamp?: number | string
  }) => (
    <div className="flex-1 p-4 rounded-lg border-2 transition-all hover:border-cyan-400/50 bg-black/20">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-mono font-bold text-cyan-100">{title}</h3>
      </div>

      {timestamp && (
        <p className="text-xs text-cyan-400/50 font-mono mb-3">
          Última modificación: {formatTimestamp(timestamp)}
        </p>
      )}

      <div className="space-y-2 text-sm font-mono">
        <div className={`flex justify-between ${highlightClass('body')}`}>
          <span className="text-cyan-400/70">Cuerpo:</span>
          <span className="text-cyan-100">{data.body}</span>
        </div>
        <div className={`flex justify-between ${highlightClass('mind')}`}>
          <span className="text-cyan-400/70">Mente:</span>
          <span className="text-cyan-100">{data.mind}</span>
        </div>
        <div className={`flex justify-between ${highlightClass('gesta')}`}>
          <span className="text-cyan-400/70">Gesta:</span>
          <span className="text-cyan-100">{data.gesta}</span>
        </div>
        <div className={`flex justify-between ${highlightClass('status')}`}>
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
          <div className={`flex justify-between ${highlightClass('day')}`}>
            <span className="text-cyan-400/70">Día:</span>
            <span className="text-cyan-100">{data.day}</span>
          </div>
          <div className={`flex justify-between ${highlightClass('hour')}`}>
            <span className="text-cyan-400/70">Hora:</span>
            <span className="text-cyan-100">{data.hour}:00</span>
          </div>
        </div>
        <div className="border-t border-cyan-400/20 pt-2 mt-2">
          <div className={`flex justify-between ${highlightClass('items') || highlightClass('weapons') ? 'bg-yellow-400/10 border-l-2 border-yellow-400 pl-2 -ml-2 rounded' : ''}`}>
            <span className="text-cyan-400/70">Inventario:</span>
            <span className="text-cyan-100 text-xs">{getItemsSummary(data)}</span>
          </div>
          <div className={`flex justify-between ${highlightClass('clues')}`}>
            <span className="text-cyan-400/70">Pistas:</span>
            <span className="text-cyan-100">{data.clues.length}</span>
          </div>
          <div className={`flex justify-between ${highlightClass('credits')}`}>
            <span className="text-cyan-400/70">Créditos:</span>
            <span className="text-cyan-100">{data.credits}</span>
          </div>
          <div className={`flex justify-between ${highlightClass('currentSection')}`}>
            <span className="text-cyan-400/70">Sección:</span>
            <span className="text-cyan-100">{data.currentSection || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg max-h-[85vh] overflow-y-auto bg-gradient-to-b from-black via-retro-darkBlue to-black border-2 border-cyan-400/50 text-cyan-100 p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {isCloudRecovery ? (
              <Download className="w-5 h-5 text-retro-green animate-pulse shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-400 animate-pulse shrink-0" />
            )}
            <DialogTitle className="font-mono text-base sm:text-xl text-cyan-400">
              {isCloudRecovery
                ? 'DATOS EN TU CUENTA'
                : 'DATOS DIFERENTES'}
            </DialogTitle>
          </div>
          <DialogDescription className="font-mono text-xs sm:text-sm text-cyan-400/70">
            {isCloudRecovery
              ? 'Se encontraron datos guardados en tu cuenta. ¿Quieres cargarlos?'
              : 'Tu dispositivo y la nube tienen datos diferentes. Selecciona cuáles conservar:'}
          </DialogDescription>
        </DialogHeader>

        {!isCloudRecovery && localData && changedFields && changedFields.length > 0 && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 my-3">
            <p className="font-mono text-xs text-yellow-400 font-bold mb-2">Diferencias:</p>
            <div className="space-y-3">
              {changedFields.map(field => (
                <div key={field} className="font-mono text-xs">
                  <span className="text-cyan-400/70">{fieldLabels[field] || field}</span>
                  <div className="flex items-start gap-2 mt-1 pl-2">
                    <div className="flex items-start gap-1.5 min-w-0 flex-1">
                      <HardDrive className="w-3 h-3 text-retro-purple shrink-0 mt-0.5" />
                      <span className="text-retro-purple break-words">{formatFieldValue(localData, field)}</span>
                    </div>
                    <div className="flex items-start gap-1.5 min-w-0 flex-1">
                      <Cloud className="w-3 h-3 text-retro-green shrink-0 mt-0.5" />
                      <span className="text-retro-green break-words">{formatFieldValue(cloudData, field)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-3 pt-2 border-t border-yellow-400/20 text-[10px] font-mono text-cyan-400/50">
              {localTimestamp && (
                <span><HardDrive className="w-2.5 h-2.5 inline text-retro-purple" /> {formatTimestamp(localTimestamp)}</span>
              )}
              {cloudTimestamp && (
                <span><Cloud className="w-2.5 h-2.5 inline text-retro-green" /> {formatTimestamp(cloudTimestamp)}</span>
              )}
            </div>
          </div>
        )}

        {isCloudRecovery && (
          <div className="my-4">
            <DataSummary
              data={cloudData}
              icon={Cloud}
              title="DATOS EN LA NUBE"
              iconColor="text-retro-green animate-pulse"
              timestamp={cloudTimestamp}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 mt-4">
          {isCloudRecovery ? (
            <>
              <Button
                onClick={onSelectCloud}
                className="w-full bg-gradient-to-br from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 text-white font-mono text-sm border-2 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)] transition-all"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Cargar datos de la nube
              </Button>
              <Button
                onClick={onSelectLocal}
                variant="outline"
                className="w-full font-mono text-sm border-2 border-cyan-400/30 text-cyan-400/70 hover:bg-cyan-400/10 hover:text-cyan-100 transition-all"
              >
                No cargar
              </Button>
            </>
          ) : (
            <>
              {localData && (
                <Button
                  onClick={onSelectLocal}
                  className="w-full bg-gradient-to-br from-retro-purple/50 to-retro-purple/30 hover:from-retro-purple/60 hover:to-retro-purple/40 text-white font-mono text-sm border-2 border-retro-purple/60 shadow-[0_4px_20px_rgba(138,43,226,0.3)] hover:shadow-[0_6px_30px_rgba(138,43,226,0.5)] transition-all"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Usar datos locales
                </Button>
              )}

              <Button
                onClick={onSelectCloud}
                className="w-full bg-gradient-to-br from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 text-white font-mono text-sm border-2 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)] transition-all"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Usar datos de la nube
              </Button>
            </>
          )}
        </div>

        <p className="text-[10px] sm:text-xs text-cyan-400/50 font-mono text-center mt-3">
          {isCloudRecovery
            ? 'Si no cargas los datos, comenzarás con una ficha en blanco'
            : '⚠️ El dato que no selecciones será sobrescrito permanentemente'}
        </p>
      </DialogContent>
    </Dialog>
  )
}
