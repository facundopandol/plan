import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalysisStatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  accent?: string
  iconBg?: string
}

export function AnalysisStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'text-foreground',
  iconBg = 'bg-muted text-muted-foreground',
}: AnalysisStatCardProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-start gap-3">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', iconBg)}>
          <Icon className="size-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className={cn('mt-1 text-xl font-semibold tabular-nums tracking-tight', accent)}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
