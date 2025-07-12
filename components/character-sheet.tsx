"use client"

import { AttributesSection } from "./attributes-section"
import { InventorySection } from "./inventory-section"
import { CluesSection } from "./clues-section"
import { TimeSection } from "./time-section"
import { NotesSection } from "./notes-section"

export function CharacterSheet() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <AttributesSection />
        <InventorySection />
        <TimeSection />
      </div>
      <div className="space-y-6">
        <CluesSection />
        <NotesSection />
      </div>
    </div>
  )
}
