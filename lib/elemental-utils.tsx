import { Flame, Snowflake, Zap } from "lucide-react"

export type ElementalType = "none" | "fire" | "ice" | "thunder"

export function getElementalIcon(type: ElementalType) {
  switch (type) {
    case "fire":
      return <Flame className="w-4 h-4 text-red-400" />
    case "ice":
      return <Snowflake className="w-4 h-4 text-blue-400" />
    case "thunder":
      return <Zap className="w-4 h-4 text-yellow-400" />
    default:
      return null
  }
}

export function getElementalColor(type: ElementalType) {
  switch (type) {
    case "fire":
      return "text-red-400"
    case "ice":
      return "text-blue-400"
    case "thunder":
      return "text-yellow-400"
    default:
      return "text-gray-400"
  }
}

export function getElementalName(type: ElementalType) {
  switch (type) {
    case "fire":
      return "Fuego"
    case "ice":
      return "Hielo"
    case "thunder":
      return "Rayo"
    default:
      return "Ninguno"
  }
}
