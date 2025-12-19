import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NumericInput } from "@/components/ui/numeric-input"
import { ElementalSelector } from "@/components/ui/elemental-selector"
import type { ElementalType } from "@/lib/elemental-utils"
import { Plus, Sword, Target } from "lucide-react"

interface AddWeaponFormProps {
  onAdd: (weapon: {
    name: string
    bonus: number
    type: "melee" | "ranged"
    elementalType: ElementalType
    elementalDamage: number
  }) => void
}

export function AddWeaponForm({ onAdd }: AddWeaponFormProps) {
  const [newWeapon, setNewWeapon] = useState({
    name: "",
    bonus: 0,
    type: "melee" as "melee" | "ranged",
    elementalType: "none" as ElementalType,
    elementalDamage: 0,
  })

  const handleAdd = () => {
    if (newWeapon.name.trim()) {
      onAdd(newWeapon)
      setNewWeapon({ name: "", bonus: 0, type: "melee", elementalType: "none", elementalDamage: 0 })
    }
  }

  return (
    <div className="space-y-3 mb-4 p-3 bg-black/10 backdrop-blur-md rounded border border-yellow-400/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          value={newWeapon.name}
          onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Nombre del arma"
          className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
        />
        <NumericInput
          value={newWeapon.bonus}
          onChange={(val) => setNewWeapon((prev) => ({ ...prev, bonus: val }))}
          placeholder="Daño base"
          className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select
          value={newWeapon.type}
          onValueChange={(value: "melee" | "ranged") => setNewWeapon((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 font-mono text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/20 backdrop-blur-xl border-yellow-400">
            <SelectItem value="melee" className="text-yellow-100 font-mono">
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                Cuerpo a cuerpo
              </div>
            </SelectItem>
            <SelectItem value="ranged" className="text-yellow-100 font-mono">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                A distancia
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <ElementalSelector
          value={newWeapon.elementalType}
          onChange={(val) => setNewWeapon((prev) => ({ ...prev, elementalType: val }))}
          className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 font-mono text-sm"
        />
        <NumericInput
          value={newWeapon.elementalDamage}
          onChange={(val) => setNewWeapon((prev) => ({ ...prev, elementalDamage: val }))}
          placeholder="Daño elemental"
          disabled={newWeapon.elementalType === "none"}
          className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm disabled:opacity-50"
        />
      </div>
      <Button onClick={handleAdd} className="bg-yellow-500 hover:bg-yellow-600 text-black w-full">
        <Plus className="w-4 h-4 mr-2" />
        AÑADIR ARMA
      </Button>
    </div>
  )
}
