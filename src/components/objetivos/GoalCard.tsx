import type { ComponentType } from 'react'
import { Calendar, DollarSign, Pencil, Percent, Trash2 } from 'lucide-react'
import type { SavingsGoal } from '@/types'
import { ProgressBar } from '@/components/ProgressBar'
import { GoalIconDisplay } from '@/components/objetivos/GoalIconDisplay'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/utils/format'
import {
  formatDaysRemaining,
  getDaysRemaining,
  getGoalProgress,
  getGoalRemaining,
  GOAL_COLOR_STYLES,
} from '@/utils/goal'

interface GoalCardProps {
  goal: SavingsGoal
  onEdit: (goal: SavingsGoal) => void
  onDelete: (goal: SavingsGoal) => void
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const styles = GOAL_COLOR_STYLES[goal.color]
  const progress = getGoalProgress(goal.savedAmount, goal.targetAmount)
  const remaining = getGoalRemaining(goal.savedAmount, goal.targetAmount)
  const daysLeft = getDaysRemaining(goal.targetDate)
  const daysLabel = formatDaysRemaining(daysLeft)

  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-md',
        `ring-1 ${styles.ring} ring-inset`,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
              styles.iconBg,
              styles.iconText,
            )}
          >
            <GoalIconDisplay icon={goal.icon} className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold tracking-tight">{goal.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Meta: {formatDate(goal.targetDate)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(goal)}>
            <Pencil className="size-3.5" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(goal)}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatCurrency(goal.savedAmount)} de {formatCurrency(goal.targetAmount)}
          </span>
          <span className={cn('font-semibold tabular-nums', styles.accent)}>{progress}%</span>
        </div>
        <ProgressBar value={progress} barClassName={styles.bar} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/40 pt-4">
        <GoalStat
          icon={Percent}
          label="Progreso"
          value={`${progress}%`}
          accent={styles.accent}
        />
        <GoalStat
          icon={DollarSign}
          label="Restante"
          value={formatCurrency(remaining)}
        />
        <GoalStat
          icon={Calendar}
          label="Tiempo"
          value={daysLabel}
          variant={daysLeft < 0 ? 'danger' : daysLeft <= 30 ? 'warning' : 'default'}
        />
      </div>
    </article>
  )
}

function GoalStat({
  icon: Icon,
  label,
  value,
  accent,
  variant = 'default',
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  accent?: string
  variant?: 'default' | 'warning' | 'danger'
}) {
  return (
    <div className="rounded-xl bg-muted/30 px-2.5 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground">
        <Icon className="size-3" />
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={cn(
          'mt-0.5 truncate text-xs font-semibold tabular-nums',
          variant === 'danger' && 'text-red-600',
          variant === 'warning' && 'text-amber-600',
          variant === 'default' && accent,
        )}
      >
        {value}
      </p>
    </div>
  )
}
