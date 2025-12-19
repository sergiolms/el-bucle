import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Lock, Unlock, Package } from "lucide-react"
import type { InventoryItem } from "../character-context"

interface ItemsListProps {
  items: InventoryItem[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onToggleLock: (id: string) => void
}

export function ItemsList({ items, onAdd, onRemove, onToggleLock }: ItemsListProps) {
  const [newItem, setNewItem] = useState("")

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem)
      setNewItem("")
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-mono text-cyan-400 mb-3">OBJETOS</h3>

      <div className="flex gap-2 mb-4">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Nuevo objeto"
          className="retro-input text-cyan-100 border-cyan-400"
        />
        <Button onClick={handleAdd} className="bg-cyan-500 hover:bg-cyan-600 text-black">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 bg-black/20 rounded border border-cyan-400/20"
          >
            <div className="flex items-center gap-2 flex-1">
              <Package className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-cyan-100 font-mono text-sm">{item.name}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleLock(item.id)}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20 p-1"
              >
                {item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/20 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-cyan-400/50 font-mono py-4">No hay objetos</div>
        )}
      </div>
      {items.some((item) => item.locked) && (
        <div className="mt-2 text-xs text-yellow-400/70 font-mono flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Los objetos bloqueados no se borran en el reset diario
        </div>
      )}
    </div>
  )
}
