import { ExternalLink, MapPinned, Minus, Plus, ScanSearch } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TANIS_MAP_ASSET_PATH, TANIS_MAP_SOURCE_URL } from "@/src/features/history/map-reference"

export function TanisMapReference() {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [fitZoom, setFitZoom] = useState(1)
  const [imageNaturalWidth, setImageNaturalWidth] = useState<number | null>(null)
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const pinchStartDistanceRef = useRef<number | null>(null)
  const pinchStartZoomRef = useRef<number | null>(null)

  const minZoom = Math.min(0.25, fitZoom)
  const clampZoom = useCallback((nextZoom: number) => {
    return Math.max(minZoom, Math.min(3, Number(nextZoom.toFixed(2))))
  }, [minZoom])

  const zoomOut = () => setZoom((currentZoom) => clampZoom(currentZoom - 0.25))
  const zoomIn = () => setZoom((currentZoom) => clampZoom(currentZoom + 0.25))
  const resetZoom = useCallback(() => setZoom(fitZoom), [fitZoom])

  const getTouchDistance = (touches: { length: number; item: (index: number) => { clientX: number; clientY: number } | null }) => {
    if (touches.length < 2) {
      return null
    }

    const firstTouch = touches.item(0)
    const secondTouch = touches.item(1)

    if (!firstTouch || !secondTouch) {
      return null
    }

    const deltaX = firstTouch.clientX - secondTouch.clientX
    const deltaY = firstTouch.clientY - secondTouch.clientY
    return Math.hypot(deltaX, deltaY)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const nextDistance = getTouchDistance(event.touches)
    if (!nextDistance) {
      return
    }

    pinchStartDistanceRef.current = nextDistance
    pinchStartZoomRef.current = zoom
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const nextDistance = getTouchDistance(event.touches)
    const startDistance = pinchStartDistanceRef.current
    const startZoom = pinchStartZoomRef.current

    if (!nextDistance || !startDistance || !startZoom) {
      return
    }

    event.preventDefault()
    const pinchScale = nextDistance / startDistance
    setZoom(clampZoom(startZoom * pinchScale))
  }

  const handleTouchEnd = () => {
    pinchStartDistanceRef.current = null
    pinchStartZoomRef.current = null
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey) {
      return
    }

    event.preventDefault()
    const zoomDelta = event.deltaY < 0 ? 0.1 : -0.1
    setZoom((currentZoom) => clampZoom(currentZoom + zoomDelta))
  }

  const computeFitZoom = useCallback(() => {
    if (!viewportRef.current || !imageNaturalWidth || !imageNaturalHeight) {
      return null
    }

    const viewportWidth = viewportRef.current.clientWidth
    const viewportHeight = viewportRef.current.clientHeight

    if (!viewportWidth || !viewportHeight) {
      return null
    }

    const nextFitZoom = Math.min(
      viewportWidth / imageNaturalWidth,
      viewportHeight / imageNaturalHeight
    )

    return Math.min(1, Number(nextFitZoom.toFixed(3)))
  }, [imageNaturalHeight, imageNaturalWidth])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      const nextFitZoom = computeFitZoom()
      if (nextFitZoom !== null) {
        setFitZoom(nextFitZoom)
        setZoom(nextFitZoom)
      }
    })

    const handleResize = () => {
      const nextFitZoom = computeFitZoom()
      if (nextFitZoom !== null) {
        setFitZoom(nextFitZoom)
      }
    }

    window.addEventListener("resize", handleResize)

      return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [computeFitZoom, isOpen])

  return (
    <>
      <div className="rounded-xl border border-retro-cyan/20 bg-black/15 backdrop-blur-md p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPinned className="w-4 h-4 text-retro-cyan" />
              <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-retro-cyan">
                Mapa de Tanis
              </p>
            </div>
            <p className="font-mono text-[10px] sm:text-xs text-retro-cyan/70">
              Abre el mapa para consultar zonas y lugares antes de crear un checkpoint.
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="retro-button text-xs sm:text-sm">
            <ScanSearch className="w-4 h-4 mr-2" />
            Ver mapa
          </Button>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(nextOpen) => {
          setIsOpen(nextOpen)
          if (!nextOpen) {
            resetZoom()
          }
        }}
      >
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-black border-2 border-retro-cyan/40 text-white p-0 overflow-hidden">
          <DialogHeader className="p-3 sm:p-4 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <DialogTitle className="font-display text-retro-cyan uppercase tracking-wider">
                  Mapa de Tanis
                </DialogTitle>
                <DialogDescription className="font-mono text-xs sm:text-sm text-retro-cyan/70">
                  Usa el zoom y desplázate dentro del mapa para revisar zonas y localizaciones.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={zoomOut} variant="outline" className="h-8 px-2.5 border-retro-purple text-retro-purple hover:bg-retro-purple/20">
                  <Minus className="w-4 h-4" />
                </Button>
                <Button onClick={resetZoom} variant="outline" className="h-8 px-2.5 border-retro-cyan text-retro-cyan hover:bg-retro-cyan/20 font-mono text-xs">
                  {Math.round(zoom * 100)}%
                </Button>
                <Button onClick={zoomIn} variant="outline" className="h-8 px-2.5 border-retro-purple text-retro-purple hover:bg-retro-purple/20">
                  <Plus className="w-4 h-4" />
                </Button>
                <a
                  href={TANIS_MAP_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-retro-green text-retro-green hover:bg-retro-green/20 font-mono text-xs"
                >
                  Fuente
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </DialogHeader>

          <div
            ref={viewportRef}
            className="flex-1 overflow-auto bg-black/40 p-3"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div className={`min-h-full flex ${zoom < 1 ? "justify-center" : "justify-start"}`}>
              <div
                className="transition-[width] duration-200"
                style={imageNaturalWidth ? { width: `${Math.round(imageNaturalWidth * zoom)}px` } : undefined}
              >
                <img
                  src={TANIS_MAP_ASSET_PATH}
                  alt="Mapa de Tanis"
                  className="block max-w-none h-auto rounded-lg border border-white/10"
                  style={imageNaturalWidth ? { width: `${Math.round(imageNaturalWidth * zoom)}px` } : undefined}
                  onLoad={(event) => {
                    const nextWidth = event.currentTarget.naturalWidth
                    const nextHeight = event.currentTarget.naturalHeight
                    if (nextWidth && nextWidth !== imageNaturalWidth) {
                      setImageNaturalWidth(nextWidth)
                    }
                    if (nextHeight && nextHeight !== imageNaturalHeight) {
                      setImageNaturalHeight(nextHeight)
                    }
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
