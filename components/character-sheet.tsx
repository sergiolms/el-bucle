
import { Suspense, lazy, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, FileText, History, Swords } from "lucide-react"
import { getTabClasses } from "@/lib/tab-styles"

const CharacterTab = lazy(async () => ({
  default: (await import("@/src/features/character/tabs/character-tab")).CharacterTab,
}))

const EquipmentTab = lazy(async () => ({
  default: (await import("@/src/features/character/tabs/equipment-tab")).EquipmentTab,
}))

const NotesTab = lazy(async () => ({
  default: (await import("@/src/features/character/tabs/notes-tab")).NotesTab,
}))

const CombatTab = lazy(async () => ({
  default: (await import("@/src/features/character/tabs/combat-tab")).CombatTab,
}))

const HistoryTab = lazy(async () => ({
  default: (await import("@/src/features/character/tabs/history-tab")).HistoryTab,
}))

function TabPanelFallback() {
  return (
    <div className="retro-card text-center font-mono text-retro-cyan/70 uppercase tracking-wider">
      Cargando seccion...
    </div>
  )
}

export function CharacterSheet() {
  const [activeTab, setActiveTab] = useState("character")

  // Manejar parámetros URL para shortcuts de PWA
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get("tab")
    if (tabParam && ["character", "equipment", "history", "notes", "combat"].includes(tabParam)) {
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
            <TabsTrigger value="history" className={getTabClasses('green', 'middle')}>
              <History className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>HISTORIAL</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className={getTabClasses('yellow', 'last')}>
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>NOTAS</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="character" className="space-y-6">
          <CharacterTab />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-6">
          <Suspense fallback={<TabPanelFallback />}>
            <EquipmentTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="combat" className="space-y-6">
          <Suspense fallback={<TabPanelFallback />}>
            <CombatTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Suspense fallback={<TabPanelFallback />}>
            <NotesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Suspense fallback={<TabPanelFallback />}>
            <HistoryTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
