
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttributesSection } from "./attributes-section"
import { InventorySection } from "./inventory-section"
import { CluesSection } from "./clues-section"
import { TimeSection } from "./time-section"
import { NotesSection } from "./notes-section"
import { CombatSection } from "./combat-section"
import { User, Package, FileText, Swords } from "lucide-react"

export function CharacterSheet() {
  const [activeTab, setActiveTab] = useState("character")

  // Manejar parámetros URL para shortcuts de PWA
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")
    if (tabParam && ["character", "equipment", "notes", "combat"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-900/50 border border-pink-500/30 p-1 rounded-lg">
          <TabsTrigger
            value="character"
            className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 data-[state=active]:border-pink-400 text-pink-300 font-mono font-bold border border-transparent hover:border-pink-400/50 transition-all duration-200"
          >
            <User className="w-4 h-4 mr-2" />
            PERSONAJE
          </TabsTrigger>
          <TabsTrigger
            value="equipment"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-400 text-cyan-300 font-mono font-bold border border-transparent hover:border-cyan-400/50 transition-all duration-200"
          >
            <Package className="w-4 h-4 mr-2" />
            EQUIPO
          </TabsTrigger>
          <TabsTrigger
            value="combat"
            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:border-red-400 text-red-300 font-mono font-bold border border-transparent hover:border-red-400/50 transition-all duration-200"
          >
            <Swords className="w-4 h-4 mr-2" />
            COMBATE
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:border-yellow-400 text-yellow-300 font-mono font-bold border border-transparent hover:border-yellow-400/50 transition-all duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            NOTAS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="character" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttributesSection />
            <TimeSection />
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <InventorySection />
            </div>
            <div className="space-y-6">
              <CluesSection />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="combat" className="space-y-6">
          <CombatSection />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <NotesSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
