import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Lock, Unlock, Package } from "lucide-react"
import type { InventoryItem } from "../character-context"
import { IconActionButton } from "@/components/shared/icon-action-button"
import { ListRow } from "@/components/shared/list-row"

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
          <ListRow
            key={item.id}
            tone="cyan"
            highlighted={item.locked}
            paddingClassName="p-2"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="relative">
                <Package className={`w-4 h-4 flex-shrink-0 ${item.locked ? 'text-yellow-400' : 'text-cyan-400'}`} />
                {item.locked && (
                  <Lock className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1" />
                )}
              </div>
              <span className={`font-mono text-sm ${item.locked ? 'text-yellow-100 font-semibold' : 'text-cyan-100'}`}>
                {item.name}
              </span>
              {item.locked && (
                <span className="text-xs text-yellow-400/70 font-mono ml-1">[PROTEGIDO]</span>
              )}
            </div>
            <div className="flex gap-1">
              <IconActionButton
                onClick={() => onToggleLock(item.id)}
                tone={item.locked ? "warning" : "neutral"}
                title={item.locked ? 'Desbloquear' : 'Bloquear'}
                icon={item.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              />
              <IconActionButton
                onClick={() => onRemove(item.id)}
                disabled={item.locked}
                title={item.locked ? 'No se puede borrar (bloqueado)' : 'Eliminar'}
                tone="danger"
                icon={<Trash2 className="w-4 h-4" />}
              />
            </div>
          </ListRow>
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
