import { Download, RefreshCw, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRegisterSW } from "virtual:pwa-register/react"

export function PwaUpdateBanner() {
  const [dismissed, setDismissed] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
      if (!registration) return

      window.setInterval(() => {
        void registration.update()
      }, 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    if (needRefresh || offlineReady) {
      setDismissed(false)
    }
  }, [needRefresh, offlineReady])

  if (dismissed || (!needRefresh && !offlineReady)) {
    return null
  }

  return (
    <div className="mb-4 sm:mb-6 rounded-xl border border-retro-cyan/30 bg-black/30 backdrop-blur-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="font-display text-retro-cyan uppercase tracking-wider text-sm sm:text-base">
            {needRefresh ? "Actualización disponible" : "App lista para usar offline"}
          </p>
          <p className="mt-1 font-mono text-[10px] sm:text-xs text-retro-cyan/70">
            {needRefresh
              ? "Hay una versión nueva de la app. Actualiza para instalarla sin tener que reinstalar la web app."
              : "La aplicación se ha guardado correctamente y podrá funcionar offline."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {needRefresh ? (
            <Button
              onClick={() => void updateServiceWorker(true)}
              className="retro-button text-xs"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          ) : (
            <Button
              onClick={() => setOfflineReady(false)}
              className="retro-button text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Entendido
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setDismissed(true)
              setNeedRefresh(false)
            }}
            className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
