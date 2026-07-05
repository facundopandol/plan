import { useEffect, useState } from 'react'
import { ArrowDown, Check } from 'lucide-react'
import type { MonthlySummary } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface PlanFlowProps {
  summary: Pick<MonthlySummary, 'income' | 'obligations'>
  savedSavingsInvestment: number
  onSaveSavingsInvestment: (amount: number) => void
}

export function PlanFlow({
  summary,
  savedSavingsInvestment,
  onSaveSavingsInvestment,
}: PlanFlowProps) {
  const [draftSavings, setDraftSavings] = useState(savedSavingsInvestment)

  useEffect(() => {
    setDraftSavings(savedSavingsInvestment)
  }, [savedSavingsInvestment])

  const afterObligations = summary.income - summary.obligations
  const freeMoney = afterObligations - draftSavings
  const hasUnsavedChanges = draftSavings !== savedSavingsInvestment
  const isNegativeFreeMoney = freeMoney < 0

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-zinc-50/80 via-white to-zinc-50/50 p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Planificación del mes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Definí cuánto reservar para ahorro e inversiones. El dinero libre se recalcula al instante.
          </p>
        </div>
        {hasUnsavedChanges && (
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => onSaveSavingsInvestment(draftSavings)}>
            <Check className="size-3.5" />
            Guardar reserva
          </Button>
        )}
      </div>

      <div className="mx-auto max-w-md space-y-0">
        <FlowRow label="Ingresos" value={summary.income} tone="income" />
        <FlowDivider />
        <FlowRow label="Obligaciones" value={summary.obligations} prefix="−" tone="obligation" />
        <FlowDivider symbol="=" />
        <FlowRow label="" value={afterObligations} muted />

        <FlowDivider />
        <div className="flex items-center justify-between gap-4 py-3">
          <span className="text-sm font-medium text-violet-700">− Ahorro / Inversión</span>
          <Input
            type="number"
            min={0}
            step={1000}
            value={Number.isFinite(draftSavings) ? draftSavings : 0}
            onChange={(event) => setDraftSavings(Number(event.target.value) || 0)}
            className="max-w-[180px] text-right font-semibold tabular-nums"
          />
        </div>

        <FlowDivider symbol="=" />
        <FlowRow
          label="Dinero libre"
          value={freeMoney}
          tone={isNegativeFreeMoney ? 'danger' : 'free'}
          highlight
        />
      </div>

      {isNegativeFreeMoney && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          La reserva supera lo que queda después de obligaciones. Ajustá ingresos, obligaciones o el monto reservado.
        </p>
      )}

      {hasUnsavedChanges && (
        <p className="mt-3 text-xs text-muted-foreground">
          Tenés cambios sin guardar en la reserva de ahorro e inversiones.
        </p>
      )}
    </div>
  )
}

function FlowRow({
  label,
  value,
  prefix,
  tone = 'default',
  highlight = false,
  muted = false,
}: {
  label: string
  value: number
  prefix?: string
  tone?: 'default' | 'income' | 'obligation' | 'free' | 'danger'
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3',
        highlight && 'rounded-xl bg-teal-50/80 px-3 -mx-3',
      )}
    >
      <span
        className={cn(
          'text-sm',
          highlight ? 'font-semibold text-teal-800' : muted ? 'text-muted-foreground' : 'font-medium',
          tone === 'income' && 'text-emerald-700',
          tone === 'obligation' && 'text-amber-700',
          tone === 'free' && 'text-teal-700',
          tone === 'danger' && 'text-red-600',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'text-lg font-semibold tabular-nums',
          tone === 'income' && 'text-emerald-700',
          tone === 'obligation' && 'text-amber-700',
          tone === 'free' && 'text-teal-700',
          tone === 'danger' && 'text-red-600',
          muted && 'text-muted-foreground',
        )}
      >
        {prefix}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  )
}

function FlowDivider({ symbol }: { symbol?: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border/60" />
      {symbol ? <span className="text-xs font-medium text-muted-foreground">{symbol}</span> : null}
      <ArrowDown className="size-3.5 text-muted-foreground/50 md:hidden" />
      <div className="h-px flex-1 bg-border/60" />
    </div>
  )
}
