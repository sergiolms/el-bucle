import { AttributesSection } from "@/components/attributes-section"
import { TimeSection } from "@/components/time-section"

export function CharacterTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttributesSection />
      <TimeSection />
    </div>
  )
}
