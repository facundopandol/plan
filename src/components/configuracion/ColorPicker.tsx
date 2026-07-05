import type { PrimaryColor } from '@/types'
import { cn } from '@/lib/utils'
import { PRIMARY_COLOR_OPTIONS, PRIMARY_COLOR_SWATCHES } from '@/utils/theme'

interface ColorPickerProps {
  value: PrimaryColor
  onChange: (color: PrimaryColor) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRIMARY_COLOR_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex size-9 items-center justify-center rounded-full border-2 transition-all',
            value === option.value
              ? 'scale-110 border-foreground'
              : 'border-transparent hover:scale-105',
          )}
        >
          <span
            className="size-6 rounded-full"
            style={{ backgroundColor: PRIMARY_COLOR_SWATCHES[option.value] }}
          />
        </button>
      ))}
    </div>
  )
}
