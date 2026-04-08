import type { CharacterData } from "@/src/features/character/model"
import {
  getObjectStore,
  HISTORY_SNAPSHOTS_STORE,
  waitForTransaction,
  wrapRequest,
} from "./database"

export const HISTORY_SNAPSHOT_EVENT = "el-bucle:history-snapshot"

export type HistorySnapshotSource = "manual" | "end-of-day"

export interface HistorySnapshotRecord {
  id: string
  character: CharacterData
  day: number
  hour: number
  createdAt: number
  source: HistorySnapshotSource
  label: string
  section: string
  zone: string
  location: string
}

interface CreateHistorySnapshotOptions {
  source: HistorySnapshotSource
  createdAt?: number
  label?: string
  section?: string
  zone?: string
  location?: string
}

function createSnapshotId() {
  return `snapshot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getSnapshotLabel(character: CharacterData, source: HistorySnapshotSource, customLabel?: string) {
  if (customLabel) {
    return customLabel
  }

  if (source === "end-of-day") {
    return `Fin del día ${character.day}`
  }

  return "Punto de guardado manual"
}

function notifyHistorySnapshot(record: HistorySnapshotRecord) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new CustomEvent(HISTORY_SNAPSHOT_EVENT, { detail: record }))
}

export async function createHistorySnapshot(
  character: CharacterData,
  options: CreateHistorySnapshotOptions
): Promise<HistorySnapshotRecord> {
  const record: HistorySnapshotRecord = {
    id: createSnapshotId(),
    character,
    day: character.day,
    hour: character.hour,
    createdAt: options.createdAt ?? Date.now(),
    source: options.source,
    label: getSnapshotLabel(character, options.source, options.label),
    section: options.section?.trim() ?? character.currentSection.trim(),
    zone: options.zone?.trim() ?? "",
    location: options.location?.trim() ?? "",
  }

  const { store, transaction } = await getObjectStore(HISTORY_SNAPSHOTS_STORE, "readwrite")
  store.put(record)
  await waitForTransaction(transaction)
  notifyHistorySnapshot(record)
  return record
}

export async function listHistorySnapshots(): Promise<HistorySnapshotRecord[]> {
  const { store } = await getObjectStore(HISTORY_SNAPSHOTS_STORE, "readonly")
  const records = await wrapRequest(store.getAll())

  return ((records as HistorySnapshotRecord[] | undefined) ?? []).sort((a, b) => {
    if (b.day !== a.day) return b.day - a.day
    if (b.hour !== a.hour) return b.hour - a.hour
    return b.createdAt - a.createdAt
  })
}
