import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const toneClasses = {
  danger: "text-red-400 hover:text-red-300 hover:bg-red-400/20",
  warning: "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20",
  neutral: "text-gray-400 hover:text-white hover:bg-white/10",
}

interface IconActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  tone?: keyof typeof toneClasses
}

export function IconActionButton({
  className,
  icon,
  tone = "neutral",
  ...props
}: IconActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-11 w-11 p-0 transition-all", toneClasses[tone], className)}
      {...props}
    >
      {icon}
    </Button>
  )
}
