"use client"

import { CharacterProvider } from "@/components/character-context"
import { CharacterSheet } from "@/components/character-sheet"

export default function Home() {
  return (
    <CharacterProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400 mb-2">
              EL BUCLE
            </h1>
            <p className="text-cyan-400 font-mono text-lg">FICHA DE PERSONAJE</p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent mt-4"></div>
          </header>
          <CharacterSheet />
        </div>
      </div>
    </CharacterProvider>
  )
}
