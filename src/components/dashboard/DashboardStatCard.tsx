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
  goal?: number
}

const variants = {
  default: {
    card: 'bg-card',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  income: {
    card: 'bg-gradient-to-br from-emerald-50/80 to-card dark:from-emerald-950/50 dark:to-card',
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  obligation: {
    card: 'bg-gradient-to-br from-amber-50/60 to-card dark:from-amber-950/45 dark:to-card',
    icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    value: 'text-amber-700 dark:text-amber-300',
  },
  available: {
    card: 'bg-gradient-to-br from-blue-50/80 to-card dark:from-blue-950/50 dark:to-card',
    icon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    value: 'text-blue-700 dark:text-blue-300',
  },
  investment: {
    card: 'bg-gradient-to-br from-violet-50/60 to-card dark:from-violet-950/45 dark:to-card',
    icon: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    value: 'text-violet-700 dark:text-violet-300',
  },
  free: {
    card: 'bg-gradient-to-br from-teal-50/80 to-card dark:from-teal-950/50 dark:to-card',
    icon: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
    value: 'text-teal-700 dark:text-teal-300',
  },
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
  featured = false,
  goal,
}: DashboardStatCardProps) {
  const style = variants[variant]
  const hasGoal = goal !== undefined && goal > 0
  const progress = hasGoal ? Math.min(Math.round((value / goal) * 100), 100) : 0

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-md',
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
          {hasGoal ? (
            <div className="mt-2.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', style.icon)}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {progress}% de {formatCurrency(goal)}
              </p>
            </div>
          ) : (
            description && (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )
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
