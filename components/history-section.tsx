import { useEffect, useMemo, useState } from "react"
import {
  ExternalLink,
  CalendarDays,
  Clock3,
  FileText,
  History,
  MapPinned,
  Package,
  ScrollText,
  ShieldAlert,
  Swords,
} from "lucide-react"
import { useCharacter } from "./character-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HISTORY_SNAPSHOT_EVENT,
  listHistorySnapshots,
  type HistorySnapshotRecord,
} from "@/src/features/persistence"
import { TANIS_MAP_ASSET_PATH, TANIS_MAP_SOURCE_URL } from "@/src/features/history/map-reference"

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`
}

function formatCreatedAt(timestamp: number) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp)
}

function getSourceLabel(source: HistorySnapshotRecord["source"]) {
  return source === "end-of-day" ? "Fin del día" : "Manual"
}

function SummaryCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-black/15 backdrop-blur-md border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 text-retro-cyan/80 font-mono text-xs uppercase tracking-wider mb-3">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}

export function HistorySection() {
  const { character } = useCharacter()
  const [snapshots, setSnapshots] = useState<HistorySnapshotRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSnapshotId, setSelectedSnapshotId] = useState("")

  useEffect(() => {
    let active = true

    const loadSnapshots = async () => {
      setLoading(true)
      const nextSnapshots = await listHistorySnapshots()

      if (!active) {
        return
      }

      setSnapshots(nextSnapshots)
      setSelectedSnapshotId((currentId) => (
        currentId && nextSnapshots.some((snapshot) => snapshot.id === currentId)
          ? currentId
          : (nextSnapshots[0]?.id ?? "")
      ))
      setLoading(false)
    }

    void loadSnapshots()

    const handleRefresh = () => {
      void loadSnapshots()
    }

    window.addEventListener(HISTORY_SNAPSHOT_EVENT, handleRefresh)

    return () => {
      active = false
      window.removeEventListener(HISTORY_SNAPSHOT_EVENT, handleRefresh)
    }
  }, [])

  const selectedSnapshot = useMemo(
    () => snapshots.find((snapshot) => snapshot.id === selectedSnapshotId) ?? null,
    [selectedSnapshotId, snapshots]
  )

  const availableDays = useMemo(
    () => Array.from(new Set(snapshots.map((snapshot) => snapshot.day))).sort((a, b) => b - a),
    [snapshots]
  )

  const selectedDay = selectedSnapshot?.day ?? availableDays[0] ?? null

  const snapshotsForSelectedDay = useMemo(
    () => snapshots.filter((snapshot) => snapshot.day === selectedDay),
    [selectedDay, snapshots]
  )

  const handleSelectDay = (dayValue: string) => {
    const nextDay = Number(dayValue)
    const nextSnapshot = snapshots.find((snapshot) => snapshot.day === nextDay)
    if (nextSnapshot) {
      setSelectedSnapshotId(nextSnapshot.id)
    }
  }

  if (loading) {
    return (
      <div className="retro-card text-center font-mono text-retro-cyan/70 uppercase tracking-wider">
        Cargando historial...
      </div>
    )
  }

  if (!snapshots.length) {
    return (
      <div className="retro-card border-retro-green">
        <div className="text-center space-y-4">
          <History className="w-10 h-10 mx-auto text-retro-green animate-neon-pulse" />
          <h2 className="retro-heading text-retro-green">Historial Temporal</h2>
          <p className="font-mono text-sm text-retro-cyan/70 max-w-2xl mx-auto">
            Aún no hay checkpoints. Se crea uno automático antes del reset diario y puedes guardar uno
            manualmente desde la sección de progreso temporal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="retro-card border-retro-green">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="retro-heading text-retro-green flex items-center gap-2">
              <History className="w-5 h-5 sm:w-6 sm:h-6 animate-neon-pulse" />
              HISTORIAL TEMPORAL
            </h2>
            <p className="mt-2 font-mono text-xs sm:text-sm text-retro-cyan/70">
              Navega checkpoints guardados por día y hora. El estado actual está en Día {character.day} a las {formatHour(character.hour)}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[420px]">
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-retro-green/80 mb-2 uppercase tracking-wider">Día</p>
              <Select value={selectedDay?.toString() ?? ""} onValueChange={handleSelectDay}>
                <SelectTrigger className="bg-black/20 border-retro-green/30 text-retro-green font-mono">
                  <SelectValue placeholder="Selecciona día" />
                </SelectTrigger>
                <SelectContent className="bg-black border-retro-green/30 text-retro-green">
                  {availableDays.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Día {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-retro-green/80 mb-2 uppercase tracking-wider">Hora / hito</p>
              <Select value={selectedSnapshotId} onValueChange={setSelectedSnapshotId}>
                <SelectTrigger className="bg-black/20 border-retro-green/30 text-retro-green font-mono">
                  <SelectValue placeholder="Selecciona checkpoint" />
                </SelectTrigger>
                <SelectContent className="bg-black border-retro-green/30 text-retro-green">
                  {snapshotsForSelectedDay.map((snapshot) => (
                    <SelectItem key={snapshot.id} value={snapshot.id}>
                      {formatHour(snapshot.hour)} · {getSourceLabel(snapshot.source)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {selectedSnapshot ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <SummaryCard title="Checkpoint" icon={<CalendarDays className="w-4 h-4" />}>
                <div className="space-y-2 font-mono text-sm text-white/80">
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Día</span>
                    <span>{selectedSnapshot.day}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Hora</span>
                    <span>{formatHour(selectedSnapshot.hour)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Tipo</span>
                    <span>{getSourceLabel(selectedSnapshot.source)}</span>
                  </div>
                </div>
              </SummaryCard>

              <SummaryCard title="Detalle" icon={<Clock3 className="w-4 h-4" />}>
                <div className="space-y-2 font-mono text-sm text-white/80">
                  <div className="text-retro-green">{selectedSnapshot.label}</div>
                  <div className="text-retro-cyan/70 text-xs">
                    Guardado el {formatCreatedAt(selectedSnapshot.createdAt)}
                  </div>
                  <div className="text-retro-cyan/70 text-xs">
                    Sección: {selectedSnapshot.section || "Sin sección"}
                  </div>
                  <div className="text-retro-cyan/70 text-xs">
                    Zona: {selectedSnapshot.zone || "Sin zona indicada"}
                  </div>
                  <div className="text-retro-cyan/70 text-xs">
                    Lugar: {selectedSnapshot.location || "Sin localización indicada"}
                  </div>
                </div>
              </SummaryCard>

              <SummaryCard title="Estado general" icon={<ShieldAlert className="w-4 h-4" />}>
                <div className="space-y-2 font-mono text-sm text-white/80">
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Estado</span>
                    <span className="uppercase">{selectedSnapshot.character.status}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Créditos</span>
                    <span>{selectedSnapshot.character.credits}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-retro-cyan/70">Enemigos</span>
                    <span>{selectedSnapshot.character.enemies.length}</span>
                  </div>
                </div>
              </SummaryCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SummaryCard title="Atributos" icon={<ShieldAlert className="w-4 h-4" />}>
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="rounded-lg border border-retro-pink/30 bg-black/20 p-3">
                    <div className="text-retro-pink/70 text-xs uppercase">Cuerpo</div>
                    <div className="text-xl text-retro-pink">{selectedSnapshot.character.body}</div>
                  </div>
                  <div className="rounded-lg border border-retro-cyan/30 bg-black/20 p-3">
                    <div className="text-retro-cyan/70 text-xs uppercase">Mente</div>
                    <div className="text-xl text-retro-cyan">{selectedSnapshot.character.mind}</div>
                  </div>
                  <div className="rounded-lg border border-retro-purple/30 bg-black/20 p-3">
                    <div className="text-retro-purple/70 text-xs uppercase">Gesta</div>
                    <div className="text-xl text-retro-purple">{selectedSnapshot.character.gesta}</div>
                  </div>
                </div>
              </SummaryCard>

              <SummaryCard title="Objetos" icon={<Package className="w-4 h-4" />}>
                {selectedSnapshot.character.items.length ? (
                  <div className="space-y-2 font-mono text-sm text-white/80 max-h-56 overflow-y-auto">
                    {selectedSnapshot.character.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                        <span>{item.name}</span>
                        <span className="text-xs text-retro-cyan/60">{item.locked ? "Fijo" : "Temporal"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-retro-cyan/60">Sin objetos en este checkpoint.</p>
                )}
              </SummaryCard>

              <SummaryCard title="Armas" icon={<Swords className="w-4 h-4" />}>
                {selectedSnapshot.character.weapons.length ? (
                  <div className="space-y-2 font-mono text-sm text-white/80 max-h-56 overflow-y-auto">
                    {selectedSnapshot.character.weapons.map((weapon) => (
                      <div key={weapon.id} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <span>{weapon.name}</span>
                          <span className="text-xs text-retro-orange/70 uppercase">{weapon.type}</span>
                        </div>
                        <div className="mt-1 text-xs text-retro-cyan/60">
                          Bonus {weapon.bonus} · {weapon.elementalType !== "none" ? `${weapon.elementalType} +${weapon.elementalDamage}` : "Sin daño elemental"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-retro-cyan/60">Sin armas registradas.</p>
                )}
              </SummaryCard>

              <SummaryCard title="Pistas y notas" icon={<ScrollText className="w-4 h-4" />}>
                <div className="space-y-4">
                  <div>
                    <p className="font-mono text-xs uppercase text-retro-yellow/80 mb-2">Pistas</p>
                    {selectedSnapshot.character.clues.length ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedSnapshot.character.clues.map((clue) => (
                          <div key={clue.id} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 font-mono text-sm text-white/80">
                            {clue.text}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-sm text-retro-cyan/60">Sin pistas guardadas.</p>
                    )}
                  </div>

                  <div>
                    <p className="font-mono text-xs uppercase text-retro-yellow/80 mb-2">Notas</p>
                    {selectedSnapshot.character.notes.length ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedSnapshot.character.notes.map((note) => (
                          <div key={note.id} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 font-mono text-sm text-white/80">
                            <div className="text-retro-yellow">{note.what || "Nota sin título"}</div>
                            <div className="text-xs text-retro-cyan/60">
                              {note.where || "Sin lugar"} · {note.when || "Sin fecha"}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-sm text-retro-cyan/60">Sin notas en este checkpoint.</p>
                    )}
                  </div>
                </div>
              </SummaryCard>

              <SummaryCard title="Enemigos" icon={<FileText className="w-4 h-4" />}>
                {selectedSnapshot.character.enemies.length ? (
                  <div className="space-y-2 font-mono text-sm text-white/80 max-h-56 overflow-y-auto">
                    {selectedSnapshot.character.enemies.map((enemy, index) => (
                      <div key={enemy.id} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <span>Enemigo {index + 1}</span>
                          <span className="text-xs text-retro-cyan/60">
                            {enemy.currentLife}/{enemy.maxLife} PV
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-retro-cyan/60">
                          Cuerpo {enemy.body} · Arma {enemy.weaponDamage}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-sm text-retro-cyan/60">Sin enemigos en este checkpoint.</p>
                )}
              </SummaryCard>
            </div>

            <SummaryCard title="Mapa de Tanis" icon={<MapPinned className="w-4 h-4" />}>
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={TANIS_MAP_ASSET_PATH}
                    alt="Mapa de Tanis"
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs text-retro-cyan/70">
                  <span>Referencia visual para las localizaciones del checkpoint.</span>
                  <a
                    href={TANIS_MAP_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-retro-green hover:text-retro-green/80"
                  >
                    Fuente original
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </SummaryCard>
          </div>
        ) : null}
      </div>
    </div>
  )
}
