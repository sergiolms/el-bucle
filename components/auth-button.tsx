import { LogIn, LogOut, Cloud, HardDrive } from "lucide-react"
import { useAuth } from "@/src/lib/useAuth"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AuthButtonProps {
  isLoggedIn: boolean
}

export function AuthButton({ isLoggedIn }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Indicador de modo de guardado */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/20 backdrop-blur-md border border-white/10">
              {isLoggedIn ? (
                <Cloud className="w-4 h-4 text-retro-green animate-pulse" />
              ) : (
                <HardDrive className="w-4 h-4 text-retro-purple" />
              )}
              <span className="text-xs font-mono text-white/70">
                {isLoggedIn ? 'Cloud' : 'Local'}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {isLoggedIn
                ? '✅ Guardado en la nube + local'
                : '💾 Guardado solo en local'}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Botón de login/logout */}
        {user ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="bg-gradient-to-br from-retro-orange/50 to-red-500/30 hover:from-retro-orange/60 hover:to-red-500/40 text-white font-mono border-2 border-retro-orange/60 shadow-[0_4px_16px_rgba(205,92,92,0.3)] hover:shadow-[0_6px_24px_rgba(205,92,92,0.5)] transition-all backdrop-blur-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{user.displayName || user.email}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                size="sm"
                className="bg-gradient-to-br from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 text-white font-mono border-2 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)] transition-all backdrop-blur-md"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Guarda tu progreso en la nube con Google</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
