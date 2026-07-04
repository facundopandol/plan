import { Clock } from 'lucide-react'
import type { Obligation } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/utils/format'
import { formatDueLabel, getDaysUntil } from '@/utils/greeting'

interface UpcomingDueDatesProps {
  obligations: Obligation[]
}

export function UpcomingDueDates({ obligations }: UpcomingDueDatesProps) {
  const upcoming = obligations
    .filter((o) => !o.paid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight">Próximos vencimientos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Obligaciones pendientes de pago
        </p>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-10 text-center">
          <Clock className="mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium">Sin vencimientos pendientes</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Todas las obligaciones del mes están al día
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((item) => {
            const days = getDaysUntil(item.dueDate)
            const urgent = days >= 0 && days <= 3

            return (
              <li
                key={item.id}
                className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border/50 hover:bg-muted/30"
              >
                <div
                  className={cn(
                    'flex size-11 shrink-0 flex-col items-center justify-center rounded-xl text-center',
                    urgent ? 'bg-amber-50 text-amber-700' : 'bg-muted/50 text-muted-foreground',
                  )}
                >
                  <span className="text-[10px] font-semibold uppercase leading-none">
                    {new Intl.DateTimeFormat('es-AR', { month: 'short' })
                      .format(new Date(item.dueDate))
                      .replace('.', '')}
                  </span>
                  <span className="mt-0.5 text-xs font-bold tabular-nums leading-none">
                    {new Date(item.dueDate).getDate()}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                    <Badge
                      variant={urgent ? 'warning' : 'outline'}
                      className="px-1.5 py-0 text-[10px] font-medium"
                    >
                      {formatDueLabel(item.dueDate)}
                    </Badge>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(item.dueDate)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
