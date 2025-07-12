"use client"

import { useState } from "react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Sword, Target } from "lucide-react"

export function InventorySection() {
  const { character, addItem, removeItem, addWeapon, removeWeapon, updateWeapon } = useCharacter()
  const [newItem, setNewItem] = useState("")
  const [newWeapon, setNewWeapon] = useState({
    name: "",
    bonus: 0,
    type: "melee" as "melee" | "ranged",
  })

  const handleAddItem = () => {
    addItem(newItem)
    setNewItem("")
  }

  const handleAddWeapon = () => {
    if (newWeapon.name.trim() && character.weapons.length < 3) {
      addWeapon(newWeapon)
      setNewWeapon({ name: "", bonus: 0, type: "melee" })
    }
  }

  return (
    <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-6 text-center">INVENTARIO</h2>

      {/* Objetos */}
      <div className="mb-6">
        <h3 className="text-lg font-mono text-cyan-300 mb-3">OBJETOS</h3>
        <div className="flex gap-2 mb-3">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nuevo objeto..."
            className="bg-gray-900/50 border-cyan-400 text-cyan-100 placeholder-cyan-400/50 font-mono"
            onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
          />
          <Button onClick={handleAddItem} className="bg-cyan-500 hover:bg-cyan-600 text-black">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {character.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-900/30 p-2 rounded border border-cyan-400/20"
            >
              <span className="text-cyan-100 font-mono text-sm">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Armas */}
      <div>
        <h3 className="text-lg font-mono text-yellow-400 mb-3">ARMAS ({character.weapons.length}/3)</h3>

        {character.weapons.length < 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-3 bg-gray-900/30 rounded border border-yellow-400/20">
            <Input
              value={newWeapon.name}
              onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre del arma"
              className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
            />
            <Input
              type="number"
              value={newWeapon.bonus}
              onChange={(e) => setNewWeapon((prev) => ({ ...prev, bonus: Number.parseInt(e.target.value) || 0 }))}
              placeholder="Bonificador"
              className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
            />
            <div className="flex gap-1">
              <Select
                value={newWeapon.type}
                onValueChange={(value: "melee" | "ranged") => setNewWeapon((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-gray-900/50 border-yellow-400 text-yellow-100 font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-yellow-400">
                  <SelectItem value="melee" className="text-yellow-100 font-mono">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      Cuerpo a cuerpo
                    </div>
                  </SelectItem>
                  <SelectItem value="ranged" className="text-yellow-100 font-mono">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />A distancia
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddWeapon} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {character.weapons.map((weapon) => (
            <div key={weapon.id} className="bg-gray-900/30 p-3 rounded border border-yellow-400/20">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <Input
                  value={weapon.name}
                  onChange={(e) => updateWeapon(weapon.id, { name: e.target.value })}
                  className="bg-gray-900/50 border-yellow-400 text-yellow-100 font-mono text-sm"
                />
                <Input
                  type="number"
                  value={weapon.bonus}
                  onChange={(e) => updateWeapon(weapon.id, { bonus: Number.parseInt(e.target.value) || 0 })}
                  className="bg-gray-900/50 border-yellow-400 text-yellow-100 font-mono text-sm"
                />
                <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm">
                  {weapon.type === "melee" ? <Sword className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  {weapon.type === "melee" ? "Cuerpo a cuerpo" : "A distancia"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWeapon(weapon.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/20 justify-self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
