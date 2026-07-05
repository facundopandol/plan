import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  barClassName?: string
  className?: string
}

export function ProgressBar({ value, barClassName, className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100)

  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-muted/60', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
