import { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  CheckSquare,
  Clock3,
  FilePlus2,
  FileText,
  History,
  Package,
  ScrollText,
  ShieldAlert,
  Swords,
  Trash2,
} from "lucide-react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SavePointDialog } from "./save-point-dialog"
import {
  deleteHistorySnapshots,
  HISTORY_SNAPSHOT_EVENT,
  listHistorySnapshots,
  type HistorySnapshotRecord,
} from "@/src/features/persistence"

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

function getRowLabel(snapshot: HistorySnapshotRecord) {
  const suffix = snapshot.source === "end-of-day"
    ? "Fin del día"
    : (snapshot.location || "Sin localización")

  return `Día ${snapshot.day} - ${formatHour(snapshot.hour)} - ${suffix}`
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
  const { character, createSavePoint } = useCharacter()
  const [snapshots, setSnapshots] = useState<HistorySnapshotRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSnapshotId, setSelectedSnapshotId] = useState("")
  const [selectedSnapshotIds, setSelectedSnapshotIds] = useState<string[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [pendingDeleteSnapshotIds, setPendingDeleteSnapshotIds] = useState<string[]>([])

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
      setSelectedSnapshotIds((currentIds) => currentIds.filter((snapshotId) => (
        nextSnapshots.some((snapshot) => snapshot.id === snapshotId)
      )))
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

  const selectedCount = selectedSnapshotIds.length

  const toggleSelection = (snapshotId: string) => {
    setSelectedSnapshotIds((currentIds) => (
      currentIds.includes(snapshotId)
        ? currentIds.filter((currentId) => currentId !== snapshotId)
        : [...currentIds, snapshotId]
    ))
  }

  const handleDeleteSnapshots = async (snapshotIds: string[]) => {
    if (!snapshotIds.length) {
      return
    }

    await deleteHistorySnapshots(snapshotIds)
  }

  const handleDeleteSelected = async () => {
    const snapshotIdsToDelete = selectedCount
      ? selectedSnapshotIds
      : (selectedSnapshot ? [selectedSnapshot.id] : [])

    setPendingDeleteSnapshotIds(snapshotIdsToDelete)
  }

  const handleDeletePreviewed = () => {
    if (!selectedSnapshot) return
    setPendingDeleteSnapshotIds([selectedSnapshot.id])
  }

  const pendingDeleteCount = pendingDeleteSnapshotIds.length

  const handleCreateSavePoint = async (details: { section: string; zone: string; location: string }) => {
    return createSavePoint(details)
  }

  if (loading) {
    return (
      <div className="retro-card text-center font-mono text-retro-cyan/70 uppercase tracking-wider">
        Cargando historial...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SavePointDialog
        currentSection={character.currentSection}
        isOpen={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleCreateSavePoint}
      />
      <Dialog open={pendingDeleteCount > 0} onOpenChange={(open) => {
        if (!open) {
          setPendingDeleteSnapshotIds([])
        }
      }}>
        <DialogContent className="max-w-md bg-black border-2 border-red-500/40 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-red-300 uppercase tracking-wider">
              Confirmar borrado
            </DialogTitle>
            <DialogDescription className="font-mono text-xs sm:text-sm text-red-200/70">
              {pendingDeleteCount > 1
                ? `Vas a eliminar ${pendingDeleteCount} saves seleccionados. Esta acción no se puede deshacer.`
                : "Vas a eliminar este save. Esta acción no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDeleteSnapshotIds([])}
              className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await handleDeleteSnapshots(pendingDeleteSnapshotIds)
                setPendingDeleteSnapshotIds([])
              }}
              className="bg-red-500/80 hover:bg-red-500 text-white font-display text-xs uppercase border-2 border-red-300/40"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar {pendingDeleteCount > 1 ? pendingDeleteCount : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="retro-card border-retro-green">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="retro-heading text-retro-green flex items-center gap-2">
              <History className="w-5 h-5 sm:w-6 sm:h-6 animate-neon-pulse" />
              HISTORIAL TEMPORAL
            </h2>
            <p className="mt-2 font-mono text-xs sm:text-sm text-retro-cyan/70">
              Gestiona tus saves y revisa el estado guardado. El estado actual está en Día {character.day} a las {formatHour(character.hour)}.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={() => setShowSaveDialog(true)} className="retro-button text-xs sm:text-sm">
              <FilePlus2 className="w-4 h-4 mr-2" />
              Crear save
            </Button>
            {selectedCount ? (
              <Button
                onClick={handleDeleteSelected}
                variant="outline"
                className="border-red-500/40 text-red-300 hover:bg-red-500/10 font-mono text-xs"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar {selectedCount}
              </Button>
            ) : null}
          </div>
        </div>

        {!snapshots.length ? (
          <div className="rounded-xl border border-retro-green/20 bg-black/15 backdrop-blur-md p-8 text-center space-y-4">
            <History className="w-10 h-10 mx-auto text-retro-green animate-neon-pulse" />
            <p className="font-mono text-sm text-retro-cyan/70 max-w-2xl mx-auto">
              Aún no hay saves. Crea uno manualmente desde aquí o desde la sección de progreso temporal.
            </p>
            <div>
              <Button onClick={() => setShowSaveDialog(true)} className="retro-button text-xs sm:text-sm">
                <FilePlus2 className="w-4 h-4 mr-2" />
                Crear primer save
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6">
            <div className="rounded-xl border border-retro-green/20 bg-black/15 backdrop-blur-md p-3">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-retro-green font-mono text-xs uppercase tracking-wider">
                  <History className="w-4 h-4" />
                  <span>Saves</span>
                </div>
                {selectedCount ? (
                  <div className="flex items-center gap-1 text-retro-cyan/70 font-mono text-[10px] sm:text-xs">
                    <CheckSquare className="w-3 h-3" />
                    <span>{selectedCount} seleccionados</span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {snapshots.map((snapshot) => {
                  const isPreviewed = snapshot.id === selectedSnapshotId
                  const isSelected = selectedSnapshotIds.includes(snapshot.id)

                  return (
                    <div
                      key={snapshot.id}
                      className={`group rounded-xl border transition-colors ${
                        isPreviewed
                          ? "border-retro-green/40 bg-retro-green/10"
                          : "border-white/10 bg-black/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-2 p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(snapshot.id)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 accent-emerald-500"
                        />

                        <button
                          type="button"
                          onClick={() => setSelectedSnapshotId(snapshot.id)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className={`font-mono text-xs sm:text-sm ${isPreviewed ? "text-retro-green" : "text-white/85"}`}>
                            {getRowLabel(snapshot)}
                          </div>
                          <div className="mt-1 font-mono text-[10px] sm:text-xs text-retro-cyan/60 truncate">
                            {snapshot.section ? `Sección ${snapshot.section}` : "Sin sección"} · {formatCreatedAt(snapshot.createdAt)}
                          </div>
                        </button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPendingDeleteSnapshotIds([snapshot.id])}
                          className={`h-8 w-8 p-0 border-red-500/40 text-red-300 hover:bg-red-500/10 ${
                            isPreviewed || isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedSnapshot ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 rounded-xl border border-retro-green/20 bg-black/15 backdrop-blur-md p-4">
                  <div>
                    <div className="font-display text-retro-green uppercase tracking-wider">
                      Vista previa
                    </div>
                    <div className="mt-1 font-mono text-sm text-white/85">
                      {getRowLabel(selectedSnapshot)}
                    </div>
                  </div>
                  <Button
                    onClick={handleDeletePreviewed}
                    variant="outline"
                    className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>

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
              </div>
            ) : (
              <div className="rounded-xl border border-retro-green/20 bg-black/15 backdrop-blur-md p-8 text-center">
                <History className="w-10 h-10 mx-auto text-retro-green animate-neon-pulse" />
                <p className="mt-4 font-mono text-sm text-retro-cyan/70">
                  Selecciona un save de la lista para ver su estado.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
