
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Plus, Trash2, FileText, ChevronDown } from "lucide-react"

export function NotesSection() {
  const { character, addNote, removeNote, updateNote } = useCharacter()

  const hasContent = (note: any) => {
    return note.what.trim() || note.where.trim() || note.when.trim() || note.other.trim()
  }

  return (
    <div className="retro-card border-retro-yellow">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <div className="relative">
          <h2 className="retro-heading text-lg sm:text-xl md:text-2xl text-center sm:text-left flex items-center gap-2 text-retro-yellow">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 animate-neon-pulse" />
            NOTAS DE INVESTIGACIÓN
          </h2>
          <div className="absolute -bottom-2 left-0 right-0 sm:left-1/4 sm:right-auto h-1 w-full sm:w-48 bg-gradient-to-r from-transparent via-retro-yellow to-transparent"></div>
        </div>
        <Button onClick={addNote} className="retro-button text-xs sm:text-sm">
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Nueva
        </Button>
      </div>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {character.notes.length === 0 ? (
          <div className="text-center text-yellow-400/50 font-mono py-8">No hay notas de investigación</div>
        ) : (
          character.notes.map((note) => {
            const noteHasContent = hasContent(note)

            return (
              <div key={note.id} className="bg-black/10 backdrop-blur-md rounded border border-yellow-400/20 overflow-hidden">
                <Collapsible defaultOpen={true}>
                  {/* Header de la nota */}
                  <div className="flex items-center justify-between p-4 bg-black/15 backdrop-blur-md">
                    <CollapsibleTrigger className="flex items-center gap-2 text-yellow-400 font-mono text-sm hover:text-yellow-300 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                      <span>NOTA #{note.id.slice(-4)}</span>
                      {noteHasContent && (
                        <span className="text-xs text-yellow-400/70">
                          ({note.what.slice(0, 20)}
                          {note.what.length > 20 ? "..." : ""})
                        </span>
                      )}
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNote(note.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Contenido de la nota - Siempre editable */}
                  <CollapsibleContent>
                    <div className="p-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Qué/Quién */}
                        <div>
                          <label className="block text-yellow-300 font-mono text-xs mb-1">QUÉ/QUIÉN</label>
                          <Textarea
                            value={note.what}
                            onChange={(e) => updateNote(note.id, { what: e.target.value })}
                            placeholder="¿Qué o quién está involucrado?"
                            className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                          />
                        </div>

                        {/* Dónde */}
                        <div>
                          <label className="block text-yellow-300 font-mono text-xs mb-1">DÓNDE</label>
                          <Textarea
                            value={note.where}
                            onChange={(e) => updateNote(note.id, { where: e.target.value })}
                            placeholder="¿Dónde ocurrió o se encontró?"
                            className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                          />
                        </div>

                        {/* Cuándo */}
                        <div>
                          <label className="block text-yellow-300 font-mono text-xs mb-1">CUÁNDO</label>
                          <Textarea
                            value={note.when}
                            onChange={(e) => updateNote(note.id, { when: e.target.value })}
                            placeholder="¿Cuándo sucedió?"
                            className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                          />
                        </div>

                        {/* Otras Notas */}
                        <div>
                          <label className="block text-yellow-300 font-mono text-xs mb-1">OTRAS NOTAS</label>
                          <Textarea
                            value={note.other}
                            onChange={(e) => updateNote(note.id, { other: e.target.value })}
                            placeholder="Información adicional..."
                            className="bg-black/15 backdrop-blur-md border-yellow-400 text-yellow-100 placeholder-yellow-400/50 font-mono text-sm min-h-[80px] resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )
          })
        )}
      </div>

      {/* Mensaje informativo sobre persistencia */}
      <div className="mt-4 text-xs text-yellow-400/70 font-mono flex items-center gap-1">
        <FileText className="w-3 h-3" />
        Las notas se conservan permanentemente y no se borran en ningún reset
      </div>
    </div>
  )
}
