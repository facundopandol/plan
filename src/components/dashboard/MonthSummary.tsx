import type { MonthlySummary } from '@/types'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface MonthSummaryProps {
  summary: MonthlySummary
}

const rows = [
  { key: 'income' as const, label: 'Ingresos', sign: null },
  { key: 'obligations' as const, label: 'Obligaciones', sign: 'minus' as const },
  { key: 'available' as const, label: 'Disponible', sign: 'equals' as const, highlight: true },
  { key: 'investmentGoal' as const, label: 'Objetivo de inversión', sign: 'minus' as const },
  { key: 'freeMoney' as const, label: 'Dinero libre', sign: 'result' as const, highlight: true },
]

export function MonthSummary({ summary }: MonthSummaryProps) {
  const obligationRate = Math.round((summary.obligations / summary.income) * 100)
  const savingsRate = Math.round((summary.freeMoney / summary.income) * 100)
  const investmentRate = Math.round((summary.investmentGoal / summary.available) * 100)

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold tracking-tight">Resumen del mes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Flujo desde ingresos hasta dinero libre
        </p>
      </div>

      <div className="space-y-1">
        {rows.map((row, index) => {
          const value = summary[row.key]
          const isHighlight = row.highlight

          return (
            <div key={row.key}>
              {index === 2 && <div className="my-3 h-px bg-border/60" />}
              {index === 4 && <div className="my-3 h-px bg-border/60" />}

              <div
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors',
                  isHighlight && 'bg-muted/40',
                )}
              >
                <span
                  className={cn(
                    'text-sm',
                    isHighlight ? 'font-medium text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {row.label}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    row.sign === 'minus' && 'text-muted-foreground',
                    row.key === 'available' && 'text-blue-600',
                    row.key === 'freeMoney' && 'text-teal-600',
                  )}
                >
                  {row.sign === 'minus' && '− '}
                  {formatCurrency(value)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/50 pt-5">
        <SummaryChip label="Comprometido" value={`${obligationRate}%`} />
        <SummaryChip label="A inversión" value={`${investmentRate}%`} />
        <SummaryChip label="Para vivir" value={`${savingsRate}%`} />
      </div>
    </div>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/30 px-3 py-2.5 text-center">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}
