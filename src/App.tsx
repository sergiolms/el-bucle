import { CharacterProvider } from "@/components/character-context"
import { CharacterSheet } from "@/components/character-sheet"

export default function App() {
  return (
    <CharacterProvider>
      <div className="min-h-screen relative transition-colors duration-300 bg-gradient-to-b from-black via-retro-darkBlue to-black">
        {/* Subtle animated grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(255, 20, 147, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 71, 137, 0.15) 1px, transparent 1px)',
               backgroundSize: '80px 80px'
             }}
        />

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl relative z-10">
          <header className="text-center mb-6 sm:mb-8">
            <div className="relative inline-block">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 sm:mb-3 leading-tight uppercase tracking-wider transition-all duration-300"
                  style={{
                    color: '#ff1493',
                    textShadow: '0 0 10px rgba(255, 20, 147, 0.3), 0 0 20px rgba(255, 20, 147, 0.1), 2px 2px 0px rgba(0,0,0,0.8)'
                  }}>
                EL BUCLE
              </h1>
              {/* Underline sutil */}
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-pink/50 to-transparent"></div>
            </div>
            <p className="font-mono text-xs sm:text-sm md:text-base text-retro-cyan/80 mt-3 sm:mt-4 tracking-widest uppercase transition-colors duration-300">
              Ficha de Personaje
            </p>

            {/* Decorative minimalist brackets */}
            <div className="relative max-w-4xl mx-auto mt-4 sm:mt-6">
              <div className="absolute top-0 left-0 w-6 sm:w-10 h-6 sm:h-10 border-l-2 border-t-2 border-retro-cyan/30 transition-colors duration-300"></div>
              <div className="absolute top-0 right-0 w-6 sm:w-10 h-6 sm:h-10 border-r-2 border-t-2 border-retro-cyan/30 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 w-6 sm:w-10 h-6 sm:h-10 border-l-2 border-b-2 border-retro-cyan/30 transition-colors duration-300"></div>
              <div className="absolute bottom-0 right-0 w-6 sm:w-10 h-6 sm:h-10 border-r-2 border-b-2 border-retro-cyan/30 transition-colors duration-300"></div>

              <div className="h-px bg-gradient-to-r from-transparent via-retro-purple/30 to-transparent my-6 sm:my-8"></div>
            </div>
          </header>

          <CharacterSheet />

          {/* Footer decoration */}
          <footer className="mt-8 sm:mt-12 text-center">
            <div className="h-px bg-gradient-to-r from-transparent via-retro-pink/30 to-transparent mb-4"></div>
            <p className="font-mono text-retro-purple/50 text-xs sm:text-sm">
              [ SYSTEM READY ]
            </p>
          </footer>
        </div>
      </div>
    </CharacterProvider>
  )
}
