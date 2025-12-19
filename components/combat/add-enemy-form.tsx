import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NumericInput } from "@/components/ui/numeric-input"
import { ElementalSelector } from "@/components/ui/elemental-selector"
import type { ElementalType } from "@/lib/elemental-utils"
import { Plus } from "lucide-react"

interface AddEnemyFormProps {
  onAdd: (enemy: {
    body: number
    maxLife: number
    weaponDamage: number
    elementalType: ElementalType
    elementalDamage: number
    useElementalDamage: boolean
  }) => void
}

export function AddEnemyForm({ onAdd }: AddEnemyFormProps) {
  const [newEnemy, setNewEnemy] = useState({
    body: 0,
    maxLife: 1,
    weaponDamage: 0,
    elementalType: "none" as ElementalType,
    elementalDamage: 0,
    useElementalDamage: false,
  })

  const handleAdd = () => {
    onAdd(newEnemy)
    setNewEnemy({
      body: 0,
      maxLife: 1,
      weaponDamage: 0,
      elementalType: "none",
      elementalDamage: 0,
      useElementalDamage: false,
    })
  }

  return (
    <div className="mb-6 p-4 bg-black/10 backdrop-blur-md rounded border border-red-400/20">
      <h3 className="text-red-300 font-mono text-sm mb-3 text-center">NUEVO ENEMIGO</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-red-300 font-mono text-xs mb-1">CUERPO (0-5)</label>
          <NumericInput
            value={newEnemy.body}
            onChange={(val) => setNewEnemy((prev) => ({ ...prev, body: val }))}
            min={0}
            max={5}
            className="bg-black/15 backdrop-blur-md border-red-400 text-red-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-red-300 font-mono text-xs mb-1">PUNTOS DE VIDA</label>
          <NumericInput
            value={newEnemy.maxLife}
            onChange={(val) => setNewEnemy((prev) => ({ ...prev, maxLife: val }))}
            min={1}
            className="bg-black/15 backdrop-blur-md border-red-400 text-red-100 font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-orange-300 font-mono text-xs mb-1">DAÑO DEL ARMA</label>
          <NumericInput
            value={newEnemy.weaponDamage}
            onChange={(val) => setNewEnemy((prev) => ({ ...prev, weaponDamage: val }))}
            min={0}
            className="bg-black/15 backdrop-blur-md border-orange-400 text-orange-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-purple-300 font-mono text-xs mb-1">ELEMENTO</label>
          <ElementalSelector
            value={newEnemy.elementalType}
            onChange={(val) => setNewEnemy((prev) => ({ ...prev, elementalType: val }))}
            className="bg-black/15 backdrop-blur-md border-purple-400 text-purple-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-purple-300 font-mono text-xs mb-1">DAÑO ELEMENTAL</label>
          <NumericInput
            value={newEnemy.elementalDamage}
            onChange={(val) => setNewEnemy((prev) => ({ ...prev, elementalDamage: val }))}
            min={0}
            disabled={newEnemy.elementalType === "none"}
            className="bg-black/15 backdrop-blur-md border-purple-400 text-purple-100 font-mono text-sm disabled:opacity-50"
          />
        </div>
      </div>

      <Button onClick={handleAdd} className="bg-red-500 hover:bg-red-600 text-white font-mono w-full">
        <Plus className="w-4 h-4 mr-2" />
        AÑADIR ENEMIGO
      </Button>
    </div>
  )
}
