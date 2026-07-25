import { Link } from 'react-router-dom'
import { ArrowDownCircle, Plus } from 'lucide-react'
import type { Obligation } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'

interface MonthObligationsSummaryProps {
  obligations: Obligation[]
}

const PREVIEW_LIMIT = 8

export function MonthObligationsSummary({ obligations }: MonthObligationsSummaryProps) {
  const sorted = obligations.slice().sort((a, b) => b.amount - a.amount)
  const items = sorted.slice(0, PREVIEW_LIMIT)
  const remaining = Math.max(0, sorted.length - items.length)
  const total = obligations.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Obligaciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compromisos de cada mes · {formatCurrency(total)}
          </p>
        </div>
        <Link
          to="/obligaciones"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          Gestionar
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ArrowDownCircle}
          compact
          className="flex-1 rounded-xl"
          title="Sin obligaciones todavía"
          description="Agregá alquiler, servicios o tarjetas para ver cuánto tenés comprometido cada mes."
          action={
            <Button asChild className="gap-2">
              <Link to="/obligaciones">
                <Plus className="size-4" />
                Agregar obligación
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border/50 hover:bg-muted/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.description ? (
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">
                {formatCurrency(item.amount)}
              </p>
            </li>
          ))}
          {remaining > 0 ? (
            <li className="px-3 pt-1">
              <Link
                to="/obligaciones"
                className="text-sm font-medium text-primary hover:underline"
              >
                +{remaining} más
              </Link>
            </li>
          ) : null}
        </ul>
      )}
    </div>
  )
}
