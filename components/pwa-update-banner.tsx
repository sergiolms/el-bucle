import { Download, RefreshCw, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRegisterSW } from "virtual:pwa-register/react"

const APP_UPDATED_KEY = "el-bucle-app-updated"

export function PwaUpdateBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [appUpdated, setAppUpdated] = useState(false)
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
      if (!registration) return

      const checkForUpdates = () => {
        void registration.update()
      }

      window.setInterval(checkForUpdates, 60 * 60 * 1000)
      window.addEventListener("focus", checkForUpdates)
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkForUpdates()
        }
      })
    },
  })

  useEffect(() => {
    if (sessionStorage.getItem(APP_UPDATED_KEY) === "1") {
      sessionStorage.removeItem(APP_UPDATED_KEY)
      setAppUpdated(true)
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    if (needRefresh || offlineReady || appUpdated) {
      setDismissed(false)
    }
  }, [needRefresh, offlineReady, appUpdated])

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    let reloading = false
    const hadController = Boolean(navigator.serviceWorker.controller)

    const handleControllerChange = () => {
      if (!hadController || reloading) {
        return
      }

      reloading = true
      sessionStorage.setItem(APP_UPDATED_KEY, "1")
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange)
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange)
    }
  }, [])

  if (dismissed || (!needRefresh && !offlineReady && !appUpdated)) {
    return null
  }

  const title = needRefresh
    ? "Actualización disponible"
    : appUpdated
      ? "App actualizada"
      : "App lista para usar offline"

  const description = needRefresh
    ? "Hay una versión nueva de la app. Actualiza para instalarla sin tener que reinstalar la web app."
    : appUpdated
      ? "La app se ha recargado con la última versión disponible."
      : "La aplicación se ha guardado correctamente y podrá funcionar offline."

  return (
    <div className="mb-4 sm:mb-6 rounded-xl border border-retro-cyan/30 bg-black/30 backdrop-blur-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="font-display text-retro-cyan uppercase tracking-wider text-sm sm:text-base">{title}</p>
          <p className="mt-1 font-mono text-[10px] sm:text-xs text-retro-cyan/70">
            {description}
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
          ) : appUpdated ? (
            <Button
              onClick={() => setAppUpdated(false)}
              className="retro-button text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Entendido
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
              setAppUpdated(false)
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
