import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const toneClasses = {
  cyan: "bg-black/20 border-cyan-400/20",
  yellow: "bg-black/20 border-yellow-400/20",
  green: "bg-black/10 border-green-400/20",
  orange: "bg-black/10 border-orange-400/20",
}

interface ListRowProps {
  children: ReactNode
  className?: string
  highlighted?: boolean
  highlightedClasses?: string
  paddingClassName?: string
  tone: keyof typeof toneClasses
  verticalAlign?: "center" | "start"
}

export function ListRow({
  children,
  className,
  highlighted = false,
  highlightedClasses = "bg-yellow-500/10 border-yellow-400/50 shadow-[0_0_8px_rgba(250,204,21,0.2)]",
  paddingClassName = "p-3",
  tone,
  verticalAlign = "center",
}: ListRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between rounded border transition-all",
        verticalAlign === "center" ? "items-center" : "items-start",
        paddingClassName,
        highlighted ? highlightedClasses : toneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  )
}
