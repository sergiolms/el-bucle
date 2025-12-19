
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttributesSection } from "./attributes-section"
import { InventorySection } from "./inventory-section"
import { CluesSection } from "./clues-section"
import { TimeSection } from "./time-section"
import { NotesSection } from "./notes-section"
import { CombatSection } from "./combat-section"
import { User, Package, FileText, Swords } from "lucide-react"
import { getTabClasses } from "@/lib/tab-styles"

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
          <TabsList className="flex w-full overflow-x-auto overflow-y-hidden gap-0 bg-black/20 backdrop-blur-xl border border-white/10 p-0 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] scrollbar-hide">
            <TabsTrigger value="character" className={getTabClasses('pink', 'first')}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>PERSONAJE</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className={getTabClasses('cyan', 'middle')}>
              <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>EQUIPO</span>
            </TabsTrigger>
            <TabsTrigger value="combat" className={getTabClasses('orange', 'middle')}>
              <Swords className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>COMBATE</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className={getTabClasses('yellow', 'last')}>
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
