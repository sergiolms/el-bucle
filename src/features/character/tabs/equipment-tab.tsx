import { CluesSection } from "@/components/clues-section"
import { InventorySection } from "@/components/inventory-section"

export function EquipmentTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <InventorySection />
      </div>
      <div className="space-y-6">
        <CluesSection />
      </div>
    </div>
  )
}
