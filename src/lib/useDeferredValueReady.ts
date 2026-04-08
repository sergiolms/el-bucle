import { useEffect, useState } from "react"

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
  cancelIdleCallback?: (handle: number) => void
}

export function useDeferredValueReady(delayMs = 250) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const idleWindow = window as IdleWindow

    let timeoutId: number | null = null
    let idleId: number | null = null

    const markReady = () => setReady(true)

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(markReady, { timeout: delayMs })
    } else {
      timeoutId = idleWindow.setTimeout(markReady, delayMs)
    }

    return () => {
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId)
      }

      if (timeoutId !== null) {
        idleWindow.clearTimeout(timeoutId)
      }
    }
  }, [delayMs])

  return ready
}
