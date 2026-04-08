import { DatabaseZap, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LEGACY_MIGRATION_NOTICE_KEY,
  LEGACY_STORAGE_MIGRATED_EVENT,
} from "@/src/features/persistence"

export function LegacyMigrationBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const syncVisibility = () => {
      setVisible(sessionStorage.getItem(LEGACY_MIGRATION_NOTICE_KEY) === "1")
    }

    syncVisibility()
    window.addEventListener(LEGACY_STORAGE_MIGRATED_EVENT, syncVisibility)

    return () => {
      window.removeEventListener(LEGACY_STORAGE_MIGRATED_EVENT, syncVisibility)
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <div className="mb-4 sm:mb-6 rounded-xl border border-retro-green/30 bg-black/30 backdrop-blur-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="font-display text-retro-green uppercase tracking-wider text-sm sm:text-base">
            Datos locales migrados
          </p>
          <p className="mt-1 font-mono text-[10px] sm:text-xs text-retro-cyan/70">
            Tu ficha local antigua se ha movido al nuevo almacenamiento del navegador. No necesitas hacer nada.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.removeItem(LEGACY_MIGRATION_NOTICE_KEY)
            setVisible(false)
          }}
          className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs"
        >
          <X className="w-4 h-4 mr-2" />
          Ocultar
        </Button>
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] sm:text-xs text-retro-green/80">
        <DatabaseZap className="w-4 h-4" />
        <span>El soporte de migración legacy seguirá activo temporalmente para usuarios que aún no hayan abierto esta versión.</span>
      </div>
    </div>
  )
}
