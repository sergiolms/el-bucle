import { User } from "lucide-react"
import { useCharacter } from "../character-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DiceRoller } from "@/components/ui/dice-roller"
import { getElementalIcon, getElementalColor } from "@/lib/elemental-utils"
import { Sword, Target } from "lucide-react"

interface PlayerPanelProps {
  isRolling: boolean
  diceDisplay: number | null
  onRoll: () => void
}

export function PlayerPanel({ isRolling, diceDisplay, onRoll }: PlayerPanelProps) {
  const { character, updateCharacter } = useCharacter()

  const getSelectedWeapon = () => {
    return character.weapons.find((w) => w.id === character.selectedWeaponId)
  }

  const getPlayerTotal = () => {
    const selectedWeapon = getSelectedWeapon()
    let weaponDamage = 0

    if (selectedWeapon) {
      weaponDamage =
        character.useElementalDamage && selectedWeapon.elementalType !== "none"
          ? selectedWeapon.elementalDamage
          : selectedWeapon.bonus
    }

    return character.body + weaponDamage + (character.lastPlayerRoll || 0)
  }

  return (
    <div className="retro-card border-retro-green">
      <div className="relative mb-6">
        <h2 className="retro-heading text-xl sm:text-2xl text-center text-retro-green">
          <User className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-neon-pulse" />
          JUGADOR
        </h2>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-retro-green to-transparent"></div>
      </div>

      {/* Selector de Arma */}
      <div className="mb-6">
        <label className="block text-green-300 font-mono text-sm mb-2">ARMA SELECCIONADA</label>
        <Select
          value={character.selectedWeaponId || "none"}
          onValueChange={(value) => updateCharacter({ selectedWeaponId: value === "none" ? null : value })}
        >
          <SelectTrigger className="retro-input text-retro-green border-retro-green">
            <SelectValue placeholder="Sin arma" />
          </SelectTrigger>
          <SelectContent className="bg-black border-2 border-retro-green">
            <SelectItem value="none" className="text-green-100 font-mono">
              Sin arma (+0)
            </SelectItem>
            {character.weapons.map((weapon) => (
              <SelectItem key={weapon.id} value={weapon.id} className="text-green-100 font-mono">
                <div className="flex items-center gap-2">
                  {weapon.type === "melee" ? <Sword className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  <span>
                    {weapon.name} (+{weapon.bonus})
                  </span>
                  {weapon.elementalType !== "none" && (
                    <span className={`flex items-center gap-1 ${getElementalColor(weapon.elementalType)}`}>
                      {getElementalIcon(weapon.elementalType)}+{weapon.elementalDamage}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toggle Daño Elemental */}
      {getSelectedWeapon() && getSelectedWeapon()?.elementalType !== "none" && (
        <div className="mb-6 p-3 bg-black/10 backdrop-blur-md rounded border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getElementalIcon(getSelectedWeapon()?.elementalType || "none")}
              <span className={`font-mono text-sm ${getElementalColor(getSelectedWeapon()?.elementalType || "none")}`}>
                Usar daño elemental (+{getSelectedWeapon()?.elementalDamage})
              </span>
            </div>
            <Switch
              checked={character.useElementalDamage}
              onCheckedChange={(checked) => updateCharacter({ useElementalDamage: checked })}
            />
          </div>
          <div className="text-xs text-gray-400 font-mono mt-1">
            {character.useElementalDamage
              ? `Usando daño ${getSelectedWeapon()?.elementalType} en lugar de daño normal`
              : "Usando daño normal"}
          </div>
        </div>
      )}

      {/* Dice Roller */}
      <DiceRoller
        value={character.lastPlayerRoll}
        displayValue={diceDisplay}
        isRolling={isRolling}
        onRoll={onRoll}
        color="green"
        size="large"
      />

      {/* Resultado */}
      {character.lastPlayerRoll && !isRolling && (
        <div className="bg-black/20 dark:bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-4">
          <div className="text-retro-green/80 font-mono text-sm mb-2 uppercase tracking-wider">Resultado del Combate</div>
          <div className="flex items-center justify-center gap-2 text-lg font-mono font-bold flex-wrap">
            <span className="text-pink-400">Cuerpo: {character.body}</span>
            <span className="text-green-300">+</span>
            {getSelectedWeapon() && (
              <>
                {character.useElementalDamage && getSelectedWeapon()?.elementalType !== "none" ? (
                  <span className={`flex items-center gap-1 ${getElementalColor(getSelectedWeapon()?.elementalType || "none")}`}>
                    {getElementalIcon(getSelectedWeapon()?.elementalType || "none")}
                    {getSelectedWeapon()?.elementalDamage}
                  </span>
                ) : (
                  <span className="text-yellow-400">Arma: {getSelectedWeapon()?.bonus}</span>
                )}
                <span className="text-green-300">+</span>
              </>
            )}
            <span className="text-green-400">Dado: {character.lastPlayerRoll}</span>
            <span className="text-green-300">=</span>
            <span className="text-green-200 text-2xl">Total: {getPlayerTotal()}</span>
          </div>
          {getSelectedWeapon() && (
            <div className="text-green-400/70 font-mono text-xs mt-2">
              Usando: {getSelectedWeapon()?.name}
              {character.useElementalDamage && getSelectedWeapon()?.elementalType !== "none"
                ? ` (daño ${getSelectedWeapon()?.elementalType})`
                : " (daño normal)"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
