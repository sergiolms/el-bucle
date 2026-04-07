import { CharacterProvider } from "@/components/character-context"
import { CharacterSheet } from "@/components/character-sheet"
import { AuthButton } from "@/components/auth-button"
import { useAuth } from "@/src/lib/useAuth"

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen relative transition-colors duration-300 bg-gradient-to-b from-black via-retro-darkBlue to-black overflow-hidden">
        {/* Animated retro grid */}
        <div className="absolute inset-0 opacity-50 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(255, 20, 147, 0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 217, 255, 0.15) 2px, transparent 2px)',
               backgroundSize: '60px 60px',
               animation: 'gridMove 20s linear infinite'
             }}
        />

        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0px, transparent 1px, transparent 2px, rgba(255, 255, 255, 0.1) 3px)',
               backgroundSize: '100% 3px'
             }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.4) 100%)'
             }}
        />

        {/* Floating neon accents */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-retro-pink/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-retro-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-retro-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl relative z-10" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}>
          {/* Top controls bar */}
          <div className="flex justify-end items-center mb-4 sm:mb-6">
            <AuthButton isLoggedIn={!!user} />
          </div>

          <header className="text-center mb-6 sm:mb-8">
            <div className="relative inline-block mb-4">
              {/* Scanlines effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-retro-pink/5 to-transparent animate-pulse"></div>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-2 sm:mb-3 leading-tight uppercase tracking-wider transition-all duration-300 relative"
                  style={{
                    color: '#ff1493',
                    textShadow: '0 0 20px rgba(255, 20, 147, 0.8), 0 0 40px rgba(255, 20, 147, 0.5), 0 0 60px rgba(255, 20, 147, 0.3), 3px 3px 0px rgba(0,0,0,0.9), -1px -1px 0px rgba(139, 71, 137, 0.5)'
                  }}>
                <span className="relative inline-block">
                  <span className="absolute inset-0 blur-sm opacity-70" style={{ color: '#8b4789' }}>EL BUCLE</span>
                  <span className="relative">EL BUCLE</span>
                </span>
              </h1>

              {/* Doble línea decorativa */}
              <div className="absolute -bottom-1 left-0 right-0 space-y-1">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-retro-pink to-transparent"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-retro-purple/50 to-transparent"></div>
              </div>
            </div>

            <div className="relative inline-block">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-retro-cyan"></div>
                <p className="font-mono text-xs sm:text-sm md:text-base text-retro-cyan tracking-widest uppercase transition-colors duration-300 relative"
                   style={{
                     textShadow: '0 0 10px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0, 217, 255, 0.4), 1px 1px 2px rgba(0,0,0,0.8)'
                   }}>
                  <span className="relative">
                    <span className="absolute inset-0 blur-sm opacity-50">[ FICHA DE PERSONAJE ]</span>
                    <span className="relative">[ FICHA DE PERSONAJE ]</span>
                  </span>
                </p>
                <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-retro-cyan"></div>
              </div>
            </div>

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
  )
}

export default function App() {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  )
}
