
import { useState } from "react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Sword, Target, Lock, Unlock, Flame, Snowflake, Zap, DollarSign } from "lucide-react" // Import DollarSign icon

export function InventorySection() {
  const {
    character,
    addItem,
    removeItem,
    toggleItemLock,
    addWeapon,
    removeWeapon,
    updateWeapon,
    toggleWeaponLock,
    updateCharacter,
  } = useCharacter()
  const [newItem, setNewItem] = useState("")
  const [newWeapon, setNewWeapon] = useState({
    name: "",
    bonus: 0,
    type: "melee" as "melee" | "ranged",
    elementalType: "none" as "none" | "fire" | "ice" | "thunder",
    elementalDamage: 0,
  })

  const handleAddItem = () => {
    addItem(newItem)
    setNewItem("")
  }

  const handleAddWeapon = () => {
    if (newWeapon.name.trim() && character.weapons.length < 3) {
      addWeapon({ ...newWeapon, locked: false })
      setNewWeapon({ name: "", bonus: 0, type: "melee", elementalType: "none", elementalDamage: 0 })
    }
  }

  const getElementalIcon = (type: string) => {
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

  const getElementalColor = (type: string) => {
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

  return (
    <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-6 text-center">INVENTARIO</h2>

      {/* Créditos */}
      <div className="mb-6 p-4 bg-gray-900/30 rounded border border-purple-400/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-purple-400" />
          <label className="text-purple-400 font-mono text-lg">CRÉDITOS</label>
        </div>
        <Input
          type="number"
          min="0"
          value={character.credits}
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              updateCharacter({ credits: '' as any })
            } else {
              const num = Number.parseInt(value)
              if (!isNaN(num) && num >= 0) {
                updateCharacter({ credits: num })
              }
            }
          }}
          onBlur={() => {
            if ((character.credits as any) === '' || character.credits === null || character.credits === undefined) {
              updateCharacter({ credits: 0 })
            }
          }}
          placeholder="0"
          className="bg-gray-900/50 border-purple-400 text-purple-100 placeholder-purple-400/50 font-mono text-center"
        />
        <div className="mt-2 text-xs text-purple-400/70 font-mono flex items-center justify-center gap-1">
          Se restablecen en el reset diario
        </div>
      </div>

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
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {character.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between bg-gray-900/30 p-2 rounded border ${
                item.locked ? "border-yellow-400/40 bg-yellow-400/5" : "border-cyan-400/20"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleItemLock(item.id)}
                  className={`p-1 ${
                    item.locked
                      ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
                  }`}
                  title={item.locked ? "Desbloquear item" : "Bloquear item"}
                >
                  {item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
                <span className={`font-mono text-sm flex-1 ${item.locked ? "text-yellow-100" : "text-cyan-100"}`}>
                  {item.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {character.items.length === 0 && (
            <div className="text-center text-cyan-400/50 font-mono py-4">No hay objetos</div>
          )}
        </div>
        {character.items.some((item) => item.locked) && (
          <div className="mt-2 text-xs text-yellow-400/70 font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Los objetos bloqueados no se borran en el reset diario
          </div>
        )}
      </div>

      {/* Armas */}
      <div>
        <h3 className="text-lg font-mono text-yellow-400 mb-3">ARMAS ({character.weapons.length}/3)</h3>

        {character.weapons.length < 3 && (
          <div className="space-y-3 mb-4 p-3 bg-gray-900/30 rounded border border-yellow-400/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={newWeapon.name}
                onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del arma"
                className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
              />
              <Input
                type="number"
                value={newWeapon.bonus}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewWeapon((prev) => ({ ...prev, bonus: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 0) {
                      setNewWeapon((prev) => ({ ...prev, bonus: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newWeapon.bonus as any) === '' || newWeapon.bonus === null || newWeapon.bonus === undefined) {
                    setNewWeapon((prev) => ({ ...prev, bonus: 0 }))
                  }
                }}
                placeholder="Daño base"
                className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
              <Select
                value={newWeapon.elementalType}
                onValueChange={(value: "none" | "fire" | "ice" | "thunder") =>
                  setNewWeapon((prev) => ({ ...prev, elementalType: value }))
                }
              >
                <SelectTrigger className="bg-gray-900/50 border-yellow-400 text-yellow-100 font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-yellow-400">
                  <SelectItem value="none" className="text-yellow-100 font-mono">
                    Sin elemento
                  </SelectItem>
                  <SelectItem value="fire" className="text-red-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Fuego
                    </div>
                  </SelectItem>
                  <SelectItem value="ice" className="text-blue-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4" />
                      Hielo
                    </div>
                  </SelectItem>
                  <SelectItem value="thunder" className="text-yellow-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Rayo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="0"
                value={newWeapon.elementalDamage}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewWeapon((prev) => ({ ...prev, elementalDamage: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 0) {
                      setNewWeapon((prev) => ({ ...prev, elementalDamage: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newWeapon.elementalDamage as any) === '' || newWeapon.elementalDamage === null || newWeapon.elementalDamage === undefined) {
                    setNewWeapon((prev) => ({ ...prev, elementalDamage: 0 }))
                  }
                }}
                placeholder="Daño elemental"
                disabled={newWeapon.elementalType === "none"}
                className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm disabled:opacity-50"
              />
            </div>
            <Button onClick={handleAddWeapon} className="bg-yellow-500 hover:bg-yellow-600 text-black w-full">
              <Plus className="w-4 h-4 mr-2" />
              AÑADIR ARMA
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {character.weapons.map((weapon) => (
            <div
              key={weapon.id}
              className={`bg-gray-900/30 p-3 rounded border ${
                weapon.locked ? "border-yellow-400/40 bg-yellow-400/5" : "border-yellow-400/20"
              }`}
            >
              <div className="grid grid-cols-1 gap-3">
                {/* Primera fila: Candado, Nombre, Daño base, Tipo, Eliminar */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWeaponLock(weapon.id)}
                    className={`p-1 ${
                      weapon.locked
                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-400/20"
                    }`}
                    title={weapon.locked ? "Desbloquear arma" : "Bloquear arma"}
                  >
                    {weapon.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </Button>
                  <Input
                    value={weapon.name}
                    onChange={(e) => updateWeapon(weapon.id, { name: e.target.value })}
                    className="bg-gray-900/50 border-yellow-400 text-yellow-100 font-mono text-sm"
                  />
                  <Input
                    type="number"
                    value={weapon.bonus}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        updateWeapon(weapon.id, { bonus: '' as any })
                      } else {
                        const num = Number.parseInt(value)
                        if (!isNaN(num) && num >= 0) {
                          updateWeapon(weapon.id, { bonus: num })
                        }
                      }
                    }}
                    onBlur={() => {
                      if ((weapon.bonus as any) === '' || weapon.bonus === null || weapon.bonus === undefined) {
                        updateWeapon(weapon.id, { bonus: 0 })
                      }
                    }}
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

                {/* Segunda fila: Daño elemental */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center pl-8">
                  <Select
                    value={weapon.elementalType}
                    onValueChange={(value: "none" | "fire" | "ice" | "thunder") =>
                      updateWeapon(weapon.id, {
                        elementalType: value,
                        elementalDamage: value === "none" ? 0 : weapon.elementalDamage,
                      })
                    }
                  >
                    <SelectTrigger className="bg-gray-900/50 border-purple-400 text-purple-100 font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-purple-400">
                      <SelectItem value="none" className="text-purple-100 font-mono">
                        Sin elemento
                      </SelectItem>
                      <SelectItem value="fire" className="text-red-400 font-mono">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          Fuego
                        </div>
                      </SelectItem>
                      <SelectItem value="ice" className="text-blue-400 font-mono">
                        <div className="flex items-center gap-2">
                          <Snowflake className="w-4 h-4" />
                          Hielo
                        </div>
                      </SelectItem>
                      <SelectItem value="thunder" className="text-yellow-400 font-mono">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Rayo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="0"
                    value={weapon.elementalDamage}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '') {
                        updateWeapon(weapon.id, { elementalDamage: '' as any })
                      } else {
                        const num = Number.parseInt(value)
                        if (!isNaN(num) && num >= 0) {
                          updateWeapon(weapon.id, { elementalDamage: num })
                        }
                      }
                    }}
                    onBlur={() => {
                      if ((weapon.elementalDamage as any) === '' || weapon.elementalDamage === null || weapon.elementalDamage === undefined) {
                        updateWeapon(weapon.id, { elementalDamage: 0 })
                      }
                    }}
                    placeholder="Daño elemental"
                    disabled={weapon.elementalType === "none"}
                    className="bg-gray-900/50 border-purple-400 text-purple-100 placeholder-purple-400/50 font-mono text-sm disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2 text-sm font-mono">
                    {weapon.elementalType !== "none" && (
                      <span className={`flex items-center gap-1 ${getElementalColor(weapon.elementalType)}`}>
                        {getElementalIcon(weapon.elementalType)}+{weapon.elementalDamage} {weapon.elementalType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {character.weapons.some((weapon) => weapon.locked) && (
          <div className="mt-2 text-xs text-yellow-400/70 font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Las armas bloqueadas no se borran en el reset diario
          </div>
        )}
      </div>
    </div>
  )
}
