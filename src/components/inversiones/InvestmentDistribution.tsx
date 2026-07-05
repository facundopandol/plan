import { ProgressBar } from '@/components/ProgressBar'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import { getDestinationStyle } from '@/utils/investment'
import type { DestinationDistribution } from '@/schemas/inversionSchemas'

interface InvestmentDistributionProps {
  items: DestinationDistribution[]
  total: number
}

export function InvestmentDistribution({ items, total }: InvestmentDistributionProps) {
  if (total === 0 || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 px-5 py-8 text-center">
        <p className="text-sm text-muted-foreground">Todavía no registraste destinos para este mes</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">Distribución del mes</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Cómo repartiste el capital reservado
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const styles = getDestinationStyle('Otro')
          return (
            <div
              key={item.label}
              className="rounded-xl border border-border/40 bg-muted/20 p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold', styles.badge)}>
                  {item.label}
                </span>
                <span className={cn('text-sm font-semibold tabular-nums', styles.accent)}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <ProgressBar
                value={item.percentage}
                barClassName={styles.bar}
                className="mt-3"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
