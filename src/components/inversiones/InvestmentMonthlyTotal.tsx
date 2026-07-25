import { PiggyBank } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

interface InvestmentMonthlyTotalProps {
  total: number
  monthLabel: string
}

export function InvestmentMonthlyTotal({ total, monthLabel }: InvestmentMonthlyTotalProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-violet-50/60 via-white to-card p-6 dark:from-violet-950/45 dark:via-card dark:to-card">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
          <PiggyBank className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total reservado — {monthLabel}</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-violet-700 dark:text-violet-300">
            {formatCurrency(total)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Capital destinado a ahorro e inversiones del mes
          </p>
        </div>
      </div>
    </div>
  )
}
