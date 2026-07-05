import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/50 bg-card p-5',
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
