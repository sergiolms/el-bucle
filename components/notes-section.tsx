"use client"

import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, FileText } from "lucide-react"

export function NotesSection() {
  const { character, addNote, removeNote, updateNote } = useCharacter()

  return (
    <div className="bg-gray-800/50 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-mono font-bold text-yellow-400 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          NOTAS DE INVESTIGACIÓN
        </h2>
        <Button onClick={addNote} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="w-4 h-4 mr-1" />
          Nueva
        </Button>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {character.notes.length === 0 ? (
          <div className="text-center text-yellow-400/50 font-mono py-8">No hay notas de investigación</div>
        ) : (
          character.notes.map((note) => (
            <div key={note.id} className="bg-gray-900/30 p-4 rounded border border-yellow-400/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-yellow-400 font-mono text-sm">NOTA #{note.id.slice(-4)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNote(note.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-300 font-mono text-xs mb-1">QUÉ/QUIÉN</label>
                  <Textarea
                    value={note.what}
                    onChange={(e) => updateNote(note.id, { what: e.target.value })}
                    placeholder="¿Qué o quién está involucrado?"
                    className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 font-mono text-xs mb-1">DÓNDE</label>
                  <Textarea
                    value={note.where}
                    onChange={(e) => updateNote(note.id, { where: e.target.value })}
                    placeholder="¿Dónde ocurrió o se encontró?"
                    className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 font-mono text-xs mb-1">CUÁNDO</label>
                  <Textarea
                    value={note.when}
                    onChange={(e) => updateNote(note.id, { when: e.target.value })}
                    placeholder="¿Cuándo sucedió?"
                    className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 font-mono text-xs mb-1">OTRAS NOTAS</label>
                  <Textarea
                    value={note.other}
                    onChange={(e) => updateNote(note.id, { other: e.target.value })}
                    placeholder="Información adicional..."
                    className="bg-gray-900/50 border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
