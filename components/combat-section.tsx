
import { useState } from "react"
import { useCharacter } from "./character-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Dice6, Sword, Target, Heart, Skull, Flame, Snowflake, Zap, User } from "lucide-react"

export function CombatSection() {
  const {
    character,
    addEnemy,
    removeEnemy,
    updateEnemy,
    updateCharacter,
    rollPlayerDice,
    rollEnemyDice,
    getEnemyName,
  } = useCharacter()
  const [newEnemy, setNewEnemy] = useState({
    body: 0,
    maxLife: 1,
    weaponDamage: 0,
    elementalType: "none" as "none" | "fire" | "ice" | "thunder",
    elementalDamage: 0,
    useElementalDamage: false,
  })

  // Dice animation states
  const [isPlayerRolling, setIsPlayerRolling] = useState(false)
  const [playerDiceDisplay, setPlayerDiceDisplay] = useState<number | null>(null)
  const [rollingEnemies, setRollingEnemies] = useState<Set<string>>(new Set())
  const [enemyDiceDisplay, setEnemyDiceDisplay] = useState<Record<string, number>>({})

  const handleAddEnemy = () => {
    addEnemy(newEnemy)
    setNewEnemy({
      body: 0,
      maxLife: 1,
      weaponDamage: 0,
      elementalType: "none",
      elementalDamage: 0,
      useElementalDamage: false,
    })
  }

  const handlePlayerRoll = () => {
    setIsPlayerRolling(true)
    setPlayerDiceDisplay(null)

    // Simulate rolling animation
    let rolls = 0
    const interval = setInterval(() => {
      setPlayerDiceDisplay(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 12) {
        clearInterval(interval)
        rollPlayerDice() // This updates character.lastPlayerRoll
        setIsPlayerRolling(false)
      }
    }, 100)
  }

  const handleEnemyRoll = (enemyId: string) => {
    setRollingEnemies(prev => new Set(prev).add(enemyId))
    setEnemyDiceDisplay(prev => ({ ...prev, [enemyId]: 0 }))

    // Simulate rolling animation
    let rolls = 0
    const interval = setInterval(() => {
      setEnemyDiceDisplay(prev => ({ ...prev, [enemyId]: Math.floor(Math.random() * 6) + 1 }))
      rolls++
      if (rolls >= 12) {
        clearInterval(interval)
        rollEnemyDice(enemyId) // This updates enemy.lastRoll
        setRollingEnemies(prev => {
          const newSet = new Set(prev)
          newSet.delete(enemyId)
          return newSet
        })
      }
    }, 100)
  }

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

  const getEnemyTotal = (enemy: any) => {
    const weaponDamage =
      enemy.useElementalDamage && enemy.elementalType !== "none" ? enemy.elementalDamage : enemy.weaponDamage

    return enemy.body + weaponDamage + (enemy.lastRoll || 0)
  }

  const getElementalIcon = (type: string) => {
    switch (type) {
      case "fire":
        return <Flame className="w-4 h-4 text-red-400" />
      case "ice":
        return <Snowflake className="w-4 h-4 text-blue-400" />
      case "thunder":
        return <Zap className="w-4 h-4 text-yellow-400" />
      default:
        return null
    }
  }

  const getElementalColor = (type: string) => {
    switch (type) {
      case "fire":
        return "text-red-400"
      case "ice":
        return "text-blue-400"
      case "thunder":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Panel del Jugador */}
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
          <div className="mb-6 p-3 bg-gray-900/30 rounded border border-purple-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getElementalIcon(getSelectedWeapon()?.elementalType || "none")}
                <span
                  className={`font-mono text-sm ${getElementalColor(getSelectedWeapon()?.elementalType || "none")}`}
                >
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

        {/* Tirada de Dados con visualización */}
        <div className="text-center space-y-4">
          {/* Visual Dice Display */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-retro-green/20 to-retro-green/5 backdrop-blur-md border-2 border-retro-green/40 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(60,179,113,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ${isPlayerRolling ? 'animate-bounce scale-110' : ''}`}>
                {(isPlayerRolling ? playerDiceDisplay : character.lastPlayerRoll) !== null ? (
                  <span className="text-5xl sm:text-6xl font-bold font-retro text-retro-green"
                        style={{ textShadow: '0 0 20px rgba(60, 179, 113, 0.8), 0 0 40px rgba(60, 179, 113, 0.4)' }}>
                    {isPlayerRolling ? playerDiceDisplay : character.lastPlayerRoll}
                  </span>
                ) : (
                  <Dice6 className="w-12 h-12 sm:w-14 sm:h-14 text-retro-green/50" />
                )}
              </div>
              {/* Glow effect when rolling */}
              {isPlayerRolling && (
                <div className="absolute inset-0 rounded-2xl bg-retro-green/30 animate-ping"></div>
              )}
            </div>
          </div>

          {/* Roll Button */}
          <Button
            onClick={handlePlayerRoll}
            disabled={isPlayerRolling}
            className="bg-gradient-to-br from-retro-green/50 to-retro-green/30 hover:from-retro-green/60 hover:to-retro-green/40 text-white font-mono font-bold px-8 py-4 text-lg border-2 border-retro-green/60 shadow-[0_4px_20px_rgba(60,179,113,0.3)] hover:shadow-[0_6px_30px_rgba(60,179,113,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-xl"
          >
            <Dice6 className="w-6 h-6 mr-2" />
            {isPlayerRolling ? 'LANZANDO...' : 'TIRAR DADO'}
          </Button>

          {character.lastPlayerRoll && !isPlayerRolling && (
            <div className="bg-black/20 dark:bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="text-retro-green/80 font-mono text-sm mb-2 uppercase tracking-wider">Resultado del Combate</div>
              <div className="flex items-center justify-center gap-2 text-lg font-mono font-bold flex-wrap">
                <span className="text-pink-400">Cuerpo: {character.body}</span>
                <span className="text-green-300">+</span>
                {getSelectedWeapon() && (
                  <>
                    {character.useElementalDamage && getSelectedWeapon()?.elementalType !== "none" ? (
                      <span
                        className={`flex items-center gap-1 ${getElementalColor(getSelectedWeapon()?.elementalType || "none")}`}
                      >
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
      </div>

      {/* Panel de Enemigos */}
      <div className="retro-card border-retro-orange">
        <div className="relative mb-6">
          <h2 className="retro-heading text-xl sm:text-2xl text-center text-retro-orange">
            <Skull className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-neon-pulse" />
            ENEMIGOS
          </h2>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gradient-to-r from-transparent via-retro-orange to-transparent"></div>
        </div>

        {/* Añadir Enemigo */}
        <div className="mb-6 p-4 bg-gray-900/30 rounded border border-red-400/20">
          <h3 className="text-red-300 font-mono text-sm mb-3 text-center">NUEVO ENEMIGO</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-red-300 font-mono text-xs mb-1">CUERPO (0-5)</label>
              <Input
                type="number"
                min="0"
                max="5"
                value={newEnemy.body}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewEnemy((prev) => ({ ...prev, body: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 0 && num <= 5) {
                      setNewEnemy((prev) => ({ ...prev, body: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newEnemy.body as any) === '' || newEnemy.body === null || newEnemy.body === undefined) {
                    setNewEnemy((prev) => ({ ...prev, body: 0 }))
                  }
                }}
                className="bg-gray-900/50 border-red-400 text-red-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-red-300 font-mono text-xs mb-1">PUNTOS DE VIDA</label>
              <Input
                type="number"
                min="1"
                value={newEnemy.maxLife}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewEnemy((prev) => ({ ...prev, maxLife: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 1) {
                      setNewEnemy((prev) => ({ ...prev, maxLife: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newEnemy.maxLife as any) === '' || newEnemy.maxLife === null || newEnemy.maxLife === undefined) {
                    setNewEnemy((prev) => ({ ...prev, maxLife: 1 }))
                  }
                }}
                className="bg-gray-900/50 border-red-400 text-red-100 font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-orange-300 font-mono text-xs mb-1">DAÑO DEL ARMA</label>
              <Input
                type="number"
                min="0"
                value={newEnemy.weaponDamage}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewEnemy((prev) => ({ ...prev, weaponDamage: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 0) {
                      setNewEnemy((prev) => ({ ...prev, weaponDamage: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newEnemy.weaponDamage as any) === '' || newEnemy.weaponDamage === null || newEnemy.weaponDamage === undefined) {
                    setNewEnemy((prev) => ({ ...prev, weaponDamage: 0 }))
                  }
                }}
                className="bg-gray-900/50 border-orange-400 text-orange-100 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-purple-300 font-mono text-xs mb-1">ELEMENTO</label>
              <Select
                value={newEnemy.elementalType}
                onValueChange={(value: "none" | "fire" | "ice" | "thunder") =>
                  setNewEnemy((prev) => ({ ...prev, elementalType: value }))
                }
              >
                <SelectTrigger className="bg-gray-900/50 border-purple-400 text-purple-100 font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-400">
                  <SelectItem value="none" className="text-purple-100 font-mono">
                    Ninguno
                  </SelectItem>
                  <SelectItem value="fire" className="text-red-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Fuego
                    </div>
                  </SelectItem>
                  <SelectItem value="ice" className="text-blue-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4" />
                      Hielo
                    </div>
                  </SelectItem>
                  <SelectItem value="thunder" className="text-yellow-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Rayo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-purple-300 font-mono text-xs mb-1">DAÑO ELEMENTAL</label>
              <Input
                type="number"
                min="0"
                value={newEnemy.elementalDamage}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    setNewEnemy((prev) => ({ ...prev, elementalDamage: '' as any }))
                  } else {
                    const num = Number.parseInt(value)
                    if (!isNaN(num) && num >= 0) {
                      setNewEnemy((prev) => ({ ...prev, elementalDamage: num }))
                    }
                  }
                }}
                onBlur={() => {
                  if ((newEnemy.elementalDamage as any) === '' || newEnemy.elementalDamage === null || newEnemy.elementalDamage === undefined) {
                    setNewEnemy((prev) => ({ ...prev, elementalDamage: 0 }))
                  }
                }}
                disabled={newEnemy.elementalType === "none"}
                className="bg-gray-900/50 border-purple-400 text-purple-100 font-mono text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <Button onClick={handleAddEnemy} className="bg-red-500 hover:bg-red-600 text-white font-mono w-full">
            <Plus className="w-4 h-4 mr-2" />
            AÑADIR ENEMIGO
          </Button>
        </div>

        {/* Lista de Enemigos */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {character.enemies.length === 0 ? (
            <div className="text-center text-red-400/50 font-mono py-8">No hay enemigos</div>
          ) : (
            character.enemies.map((enemy, index) => (
              <div key={enemy.id} className="bg-gray-900/30 border border-red-400/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-red-400 font-mono font-bold">{getEnemyName(index)}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEnemy(enemy.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Vida del Enemigo */}
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-mono text-sm">Vida:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateEnemy(enemy.id, { currentLife: Math.max(0, enemy.currentLife - 1) })}
                      className="text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
                    >
                      -
                    </Button>
                    <span
                      className={`font-mono font-bold px-2 ${enemy.currentLife <= 0 ? "text-red-600" : "text-red-300"}`}
                    >
                      {enemy.currentLife}/{enemy.maxLife}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateEnemy(enemy.id, { currentLife: Math.min(enemy.maxLife, enemy.currentLife + 1) })
                      }
                      className="text-red-400 hover:bg-red-400/20 w-6 h-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                  {enemy.currentLife <= 0 && <Skull className="w-4 h-4 text-red-600 ml-2" />}
                </div>

                {/* Atributo Cuerpo del Enemigo */}
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-300 font-mono text-sm">Cuerpo:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateEnemy(enemy.id, { body: Math.max(0, enemy.body - 1) })}
                      className="text-pink-400 hover:bg-pink-400/20 w-6 h-6 p-0"
                    >
                      -
                    </Button>
                    <span className="font-mono font-bold px-2 text-pink-300">{enemy.body}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateEnemy(enemy.id, { body: Math.min(5, enemy.body + 1) })}
                      className="text-pink-400 hover:bg-pink-400/20 w-6 h-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Arma del Enemigo */}
                <div className="flex items-center gap-2 mb-3">
                  <Sword className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 font-mono text-sm">
                    Daño: +{enemy.weaponDamage}
                    {enemy.elementalType !== "none" && (
                      <span className={`ml-2 flex items-center gap-1 ${getElementalColor(enemy.elementalType)}`}>
                        {getElementalIcon(enemy.elementalType)}+{enemy.elementalDamage}
                      </span>
                    )}
                  </span>
                </div>

                {/* Toggle Elemental del Enemigo */}
                {enemy.elementalType !== "none" && (
                  <div className="mb-3 p-2 bg-gray-900/50 rounded border border-purple-400/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getElementalIcon(enemy.elementalType)}
                        <span className={`font-mono text-xs ${getElementalColor(enemy.elementalType)}`}>
                          Daño elemental (+{enemy.elementalDamage})
                        </span>
                      </div>
                      <Switch
                        checked={enemy.useElementalDamage}
                        onCheckedChange={(checked) => updateEnemy(enemy.id, { useElementalDamage: checked })}
                      />
                    </div>
                  </div>
                )}

                {/* Tirada del Enemigo con visualización */}
                <div className="text-center space-y-3">
                  {/* Visual Dice Display for Enemy */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-retro-orange/20 to-red-500/10 backdrop-blur-md border-2 border-retro-orange/40 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(205,92,92,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ${rollingEnemies.has(enemy.id) ? 'animate-bounce scale-110' : ''}`}>
                        {(rollingEnemies.has(enemy.id) ? enemyDiceDisplay[enemy.id] : enemy.lastRoll) ? (
                          <span className="text-3xl sm:text-4xl font-bold font-retro text-retro-orange"
                                style={{ textShadow: '0 0 15px rgba(205, 92, 92, 0.8), 0 0 30px rgba(205, 92, 92, 0.4)' }}>
                            {rollingEnemies.has(enemy.id) ? enemyDiceDisplay[enemy.id] : enemy.lastRoll}
                          </span>
                        ) : (
                          <Dice6 className="w-8 h-8 sm:w-10 sm:h-10 text-retro-orange/50" />
                        )}
                      </div>
                      {/* Glow effect when rolling */}
                      {rollingEnemies.has(enemy.id) && (
                        <div className="absolute inset-0 rounded-xl bg-retro-orange/30 animate-ping"></div>
                      )}
                    </div>
                  </div>

                  {/* Roll Button */}
                  <Button
                    onClick={() => handleEnemyRoll(enemy.id)}
                    disabled={enemy.currentLife <= 0 || rollingEnemies.has(enemy.id)}
                    className="bg-gradient-to-br from-retro-orange/50 to-red-500/40 hover:from-retro-orange/60 hover:to-red-500/50 text-white font-mono font-bold text-sm px-4 py-2 border-2 border-retro-orange/60 shadow-[0_4px_16px_rgba(205,92,92,0.3)] hover:shadow-[0_6px_24px_rgba(205,92,92,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md rounded-lg w-full"
                  >
                    <Dice6 className="w-4 h-4 mr-1" />
                    {rollingEnemies.has(enemy.id) ? 'LANZANDO...' : 'TIRAR'}
                  </Button>

                  {enemy.lastRoll && !rollingEnemies.has(enemy.id) && (
                    <div className="bg-black/20 dark:bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-mono flex-wrap">
                        <span className="text-pink-400">Cuerpo: {enemy.body}</span>
                        <span className="text-red-300">+</span>
                        {enemy.useElementalDamage && enemy.elementalType !== "none" ? (
                          <span className={`flex items-center gap-1 ${getElementalColor(enemy.elementalType)}`}>
                            {getElementalIcon(enemy.elementalType)}
                            {enemy.elementalDamage}
                          </span>
                        ) : (
                          <span className="text-orange-400">Arma: {enemy.weaponDamage}</span>
                        )}
                        <span className="text-red-300">+</span>
                        <span className="text-red-400">Dado: {enemy.lastRoll}</span>
                        <span className="text-red-300">=</span>
                        <span className="text-red-200 font-bold">Total: {getEnemyTotal(enemy)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
