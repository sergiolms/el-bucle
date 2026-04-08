
import { useState } from "react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Clock, FileText } from "lucide-react"
import { IconActionButton } from "@/components/shared/icon-action-button"
import { ListRow } from "@/components/shared/list-row"

export function CluesSection() {
  const { character, addClue, removeClue, clearTemporalClues } = useCharacter()
  const [newClue, setNewClue] = useState("")
  const [clueType, setClueType] = useState<"normal" | "temporal">("normal")

  const handleAddClue = () => {
    addClue(newClue, clueType)
    setNewClue("")
  }

  const normalClues = character.clues.filter((c) => c.type === "normal")
  const temporalClues = character.clues.filter((c) => c.type === "temporal")

  return (
    <div className="retro-card border-retro-yellow">
      <div className="relative mb-6">
        <h2 className="retro-heading text-xl sm:text-2xl text-center text-retro-yellow">
          PISTAS
        </h2>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-retro-yellow to-transparent"></div>
      </div>

      {/* Añadir nueva pista */}
      <div className="mb-6 p-4 bg-black/10 backdrop-blur-md rounded border border-green-400/20">
        <div className="flex gap-2 mb-3">
          <Button
            variant={clueType === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => setClueType("normal")}
            className={
              clueType === "normal"
                ? "bg-green-500 text-black"
                : "border-green-400 text-green-400 hover:bg-green-400/20"
            }
          >
            <FileText className="w-4 h-4 mr-1" />
            Normal
          </Button>
          <Button
            variant={clueType === "temporal" ? "default" : "outline"}
            size="sm"
            onClick={() => setClueType("temporal")}
            className={
              clueType === "temporal"
                ? "bg-orange-500 text-black"
                : "border-orange-400 text-orange-400 hover:bg-orange-400/20"
            }
          >
            <Clock className="w-4 h-4 mr-1" />
            Temporal
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={newClue}
            onChange={(e) => setNewClue(e.target.value)}
            placeholder="Nueva pista..."
            className="bg-black/15 backdrop-blur-md border-green-400 text-green-100 placeholder-green-400/50 font-mono"
            onKeyPress={(e) => e.key === "Enter" && handleAddClue()}
          />
          <Button onClick={handleAddClue} className="bg-green-500 hover:bg-green-600 text-black">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pistas Normales */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-mono text-green-300 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            NORMALES ({normalClues.length})
          </h3>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {normalClues.map((clue) => (
            <ListRow
              key={clue.id}
              tone="green"
              verticalAlign="start"
            >
              <span className="text-green-100 font-mono text-sm flex-1 mr-2">{clue.text}</span>
              <IconActionButton
                onClick={() => removeClue(clue.id)}
                className="flex-shrink-0"
                tone="danger"
                icon={<Trash2 className="w-4 h-4" />}
              />
            </ListRow>
          ))}
        </div>
      </div>

      {/* Pistas Temporales */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-mono text-orange-300 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            TEMPORALES ({temporalClues.length})
          </h3>
          {temporalClues.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearTemporalClues}
              className="border-red-400 text-red-400 hover:bg-red-400/20 bg-transparent"
            >
              Borrar todas
            </Button>
          )}
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {temporalClues.map((clue) => (
            <ListRow
              key={clue.id}
              tone="orange"
              verticalAlign="start"
            >
              <span className="text-orange-100 font-mono text-sm flex-1 mr-2">{clue.text}</span>
              <IconActionButton
                onClick={() => removeClue(clue.id)}
                className="flex-shrink-0"
                tone="danger"
                icon={<Trash2 className="w-4 h-4" />}
              />
            </ListRow>
          ))}
        </div>
      </div>
    </div>
  )
}
