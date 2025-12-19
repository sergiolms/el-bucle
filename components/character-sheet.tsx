
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
        {/* Scrollable tabs container for mobile */}
        <div className="relative mb-6 sm:mb-8">
          <TabsList className="flex w-full overflow-x-auto overflow-y-hidden gap-0 bg-black/40 backdrop-blur-md border border-white/10 p-0 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] scrollbar-hide">
            <TabsTrigger
              value="character"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-retro-pink/30 data-[state=active]:to-retro-pink/10 data-[state=active]:text-retro-pink data-[state=active]:border-retro-pink/40 data-[state=active]:shadow-[0_0_12px_rgba(255,20,147,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] text-retro-pink/60 font-mono text-sm sm:text-base uppercase border border-l-0 border-white/5 hover:border-retro-pink/20 hover:text-retro-pink/90 hover:bg-white/5 transition-all duration-300 py-3 px-4 sm:px-6 rounded-none first:rounded-l-xl flex items-center justify-center gap-2.5 whitespace-nowrap backdrop-blur-sm flex-shrink-0 flex-1"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>PERSONAJE</span>
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-retro-cyan/30 data-[state=active]:to-retro-cyan/10 data-[state=active]:text-retro-cyan data-[state=active]:border-retro-cyan/40 data-[state=active]:shadow-[0_0_12px_rgba(32,178,170,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] text-retro-cyan/60 font-mono text-sm sm:text-base uppercase border border-white/5 hover:border-retro-cyan/20 hover:text-retro-cyan/90 hover:bg-white/5 transition-all duration-300 py-3 px-4 sm:px-6 rounded-none flex items-center justify-center gap-2.5 whitespace-nowrap backdrop-blur-sm flex-shrink-0 flex-1"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>EQUIPO</span>
            </TabsTrigger>
            <TabsTrigger
              value="combat"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-retro-orange/30 data-[state=active]:to-retro-orange/10 data-[state=active]:text-retro-orange data-[state=active]:border-retro-orange/40 data-[state=active]:shadow-[0_0_12px_rgba(205,92,92,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] text-retro-orange/60 font-mono text-sm sm:text-base uppercase border border-white/5 hover:border-retro-orange/20 hover:text-retro-orange/90 hover:bg-white/5 transition-all duration-300 py-3 px-4 sm:px-6 rounded-none flex items-center justify-center gap-2.5 whitespace-nowrap backdrop-blur-sm flex-shrink-0 flex-1"
            >
              <Swords className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>COMBATE</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-retro-yellow/30 data-[state=active]:to-retro-yellow/10 data-[state=active]:text-retro-yellow data-[state=active]:border-retro-yellow/40 data-[state=active]:shadow-[0_0_12px_rgba(218,165,32,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] text-retro-yellow/60 font-mono text-sm sm:text-base uppercase border border-r-0 border-white/5 hover:border-retro-yellow/20 hover:text-retro-yellow/90 hover:bg-white/5 transition-all duration-300 py-3 px-4 sm:px-6 rounded-none last:rounded-r-xl flex items-center justify-center gap-2.5 whitespace-nowrap backdrop-blur-sm flex-shrink-0 flex-1"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>NOTAS</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
