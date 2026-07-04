import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface DashboardStatCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'income' | 'obligation' | 'available' | 'investment' | 'free'
  featured?: boolean
}

const variants = {
  default: {
    card: 'bg-card',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  income: {
    card: 'bg-gradient-to-br from-emerald-50/80 to-card',
    icon: 'bg-emerald-100 text-emerald-700',
    value: 'text-emerald-700',
  },
  obligation: {
    card: 'bg-gradient-to-br from-amber-50/60 to-card',
    icon: 'bg-amber-100 text-amber-700',
    value: 'text-amber-700',
  },
  available: {
    card: 'bg-gradient-to-br from-blue-50/80 to-card',
    icon: 'bg-blue-100 text-blue-700',
    value: 'text-blue-700',
  },
  investment: {
    card: 'bg-gradient-to-br from-violet-50/60 to-card',
    icon: 'bg-violet-100 text-violet-700',
    value: 'text-foreground',
  },
  free: {
    card: 'bg-gradient-to-br from-teal-50/80 to-card',
    icon: 'bg-teal-100 text-teal-700',
    value: 'text-teal-700',
  },
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
  featured = false,
}: DashboardStatCardProps) {
  const style = variants[variant]

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 p-5 transition-all duration-300 hover:border-border hover:shadow-md',
        style.card,
        featured && 'sm:col-span-2 lg:col-span-1',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p
            className={cn(
              'mt-2 font-semibold tracking-tight tabular-nums',
              featured ? 'text-3xl' : 'text-2xl',
              style.value,
            )}
          >
            {formatCurrency(value)}
          </p>
          {description && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
            style.icon,
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  )
}
