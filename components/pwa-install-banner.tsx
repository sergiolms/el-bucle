import { Download, Smartphone, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const INSTALL_BANNER_DISMISSED_KEY = "el-bucle-install-banner-dismissed"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (typeof navigator !== "undefined" &&
      "standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function getInstallHint() {
  if (typeof navigator === "undefined") {
    return "Instálala desde el menú del navegador para abrirla como app."
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isIos = /iphone|ipad|ipod/.test(userAgent)
  const isAndroid = /android/.test(userAgent)

  if (isIos) {
    return "En Safari, pulsa Compartir y luego Añadir a pantalla de inicio."
  }

  if (isAndroid) {
    return "Abre el menú del navegador y pulsa Instalar app o Añadir a pantalla de inicio."
  }

  return "Usa el icono de instalar de la barra del navegador o el menú para guardarla como app."
}

function getInstallInstructions() {
  if (typeof navigator === "undefined") {
    return [
      "Abre el menú principal de tu navegador.",
      "Busca la opción para instalar la app o añadirla a la pantalla de inicio.",
      "Confirma la instalación para abrir El Bucle como una app local.",
    ]
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isIosChrome = /crios/.test(userAgent)
  const isIosSafari = /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) && !/crios|fxios/.test(userAgent)
  const isAndroidChrome = /android/.test(userAgent) && /chrome/.test(userAgent)

  if (isIosChrome) {
    return [
      "Pulsa el menú de Chrome.",
      "Elige Añadir a pantalla de inicio.",
      "Confirma para guardarla como app en tu iPhone.",
    ]
  }

  if (isIosSafari) {
    return [
      "Pulsa Compartir en Safari.",
      "Elige Añadir a pantalla de inicio.",
      "Confirma para guardarla como app en tu iPhone.",
    ]
  }

  if (isAndroidChrome) {
    return [
      "Pulsa el menú de Chrome.",
      "Elige Instalar app o Añadir a pantalla de inicio.",
      "Confirma para guardar El Bucle como app.",
    ]
  }

  return [
    "Abre el menú principal de tu navegador.",
    "Busca Instalar app o Añadir a pantalla de inicio.",
    "Si no aparece, prueba también desde el icono de instalar de la barra del navegador.",
  ]
}

export function PwaInstallBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode())
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const installHint = useMemo(() => getInstallHint(), [])
  const installInstructions = useMemo(() => getInstallInstructions(), [])

  useEffect(() => {
    setDismissed(localStorage.getItem(INSTALL_BANNER_DISMISSED_KEY) === "true")
    setIsInstalled(isStandaloneMode())

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  if (dismissed || isInstalled) {
    return null
  }

  return (
    <div className="mb-4 sm:mb-6 rounded-xl border border-retro-pink/30 bg-black/30 backdrop-blur-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <p className="font-display text-retro-pink uppercase tracking-wider text-sm sm:text-base">
            Instala la app
          </p>
          <p className="mt-1 font-mono text-[10px] sm:text-xs text-retro-pink/70">
            {installPrompt
              ? "Puedes instalar El Bucle en este dispositivo para abrirla desde tu pantalla de inicio y usarla como app."
              : installHint}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {installPrompt ? (
            <Button
              onClick={async () => {
                await installPrompt.prompt()
                const result = await installPrompt.userChoice
                if (result.outcome === "accepted") {
                  setIsInstalled(true)
                }
                setInstallPrompt(null)
              }}
              className="retro-button text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar
            </Button>
          ) : (
            <Button
              onClick={() => setInstructionsOpen(true)}
              className="retro-button text-xs"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Cómo instalar
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => {
              localStorage.setItem(INSTALL_BANNER_DISMISSED_KEY, "true")
              setDismissed(true)
            }}
            className="border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/20 font-display text-xs"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Dialog open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <DialogContent className="max-w-md bg-black border-2 border-retro-pink/40 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-retro-pink uppercase tracking-wider">
              Cómo instalar la app
            </DialogTitle>
            <DialogDescription className="font-mono text-xs sm:text-sm text-retro-pink/70">
              Sigue estos pasos en tu navegador. Si no ves la opción exacta, revisa también el menú principal y la barra superior.
            </DialogDescription>
          </DialogHeader>

          <ol className="space-y-3 font-mono text-xs sm:text-sm text-retro-cyan/80 list-decimal pl-5">
            {installInstructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  )
}
