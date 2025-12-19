// Shared tab styling constants
export const TAB_BASE_CLASSES = "font-mono text-sm sm:text-base uppercase border border-white/5 hover:bg-white/5 transition-all duration-300 py-3 px-4 sm:px-6 rounded-none flex items-center justify-center gap-2.5 whitespace-nowrap backdrop-blur-md flex-shrink-0 flex-1"

export const TAB_ACTIVE_CLASSES = "data-[state=active]:bg-gradient-to-br data-[state=active]:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"

export function getTabClasses(color: 'pink' | 'cyan' | 'orange' | 'yellow', position: 'first' | 'middle' | 'last') {
  const colorClasses = {
    pink: {
      active: "data-[state=active]:from-retro-pink/20 data-[state=active]:to-transparent data-[state=active]:text-retro-pink data-[state=active]:border-retro-pink/40 data-[state=active]:shadow-[0_0_16px_rgba(255,20,147,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      default: "text-retro-pink/60 hover:border-retro-pink/20 hover:text-retro-pink/90 bg-transparent"
    },
    cyan: {
      active: "data-[state=active]:from-retro-cyan/20 data-[state=active]:to-transparent data-[state=active]:text-retro-cyan data-[state=active]:border-retro-cyan/40 data-[state=active]:shadow-[0_0_16px_rgba(0,217,255,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      default: "text-retro-cyan/60 hover:border-retro-cyan/20 hover:text-retro-cyan/90 bg-transparent"
    },
    orange: {
      active: "data-[state=active]:from-retro-orange/20 data-[state=active]:to-transparent data-[state=active]:text-retro-orange data-[state=active]:border-retro-orange/40 data-[state=active]:shadow-[0_0_16px_rgba(205,92,92,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      default: "text-retro-orange/60 hover:border-retro-orange/20 hover:text-retro-orange/90 bg-transparent"
    },
    yellow: {
      active: "data-[state=active]:from-retro-yellow/20 data-[state=active]:to-transparent data-[state=active]:text-retro-yellow data-[state=active]:border-retro-yellow/40 data-[state=active]:shadow-[0_0_16px_rgba(218,165,32,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
      default: "text-retro-yellow/60 hover:border-retro-yellow/20 hover:text-retro-yellow/90 bg-transparent"
    }
  }

  const positionClasses = {
    first: "border-l-0 first:rounded-l-xl",
    middle: "",
    last: "border-r-0 last:rounded-r-xl"
  }

  return `${TAB_BASE_CLASSES} ${colorClasses[color].active} ${colorClasses[color].default} ${positionClasses[position]}`
}
