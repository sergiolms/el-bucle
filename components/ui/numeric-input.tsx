import { Input } from "@/components/ui/input"
import { useState } from "react"

interface NumericInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function NumericInput({
  value,
  onChange,
  min = 0,
  max,
  placeholder,
  className,
  disabled
}: NumericInputProps) {
  const [internalValue, setInternalValue] = useState<string>(value.toString())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d-]/g, "")
    setInternalValue(val)
    if (val === '' || val === '-') {
      return
    }

    const num = Number.parseInt(val, 10)
    if (!isNaN(num)) {
      const clampedValue = max !== undefined
        ? Math.min(max, Math.max(min, num))
        : Math.max(min, num)

      onChange(clampedValue)
      setInternalValue(clampedValue.toString())
    }
  }

  const handleBlur = () => {
    if (internalValue === '' || internalValue === '-') {
      onChange(min)
      setInternalValue(min.toString())
    } else {
      setInternalValue(value.toString())
    }
  }

  const handleFocus = () => setInternalValue(value.toString());

  return (
    <Input
      type="text"
      min={min}
      max={max}
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  )
}
