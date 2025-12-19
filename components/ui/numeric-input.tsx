import { Input } from "@/components/ui/input"

interface NumericInputProps {
  value: number | string
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      onChange(min)
      return
    }
    const num = Number.parseInt(val)
    if (!isNaN(num)) {
      if (max !== undefined) {
        onChange(Math.min(max, Math.max(min, num)))
      } else {
        onChange(Math.max(min, num))
      }
    }
  }

  const handleBlur = () => {
    if (value === '' || value === null || value === undefined) {
      onChange(min)
    }
  }

  return (
    <Input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  )
}
