import { useState } from 'react'
import { Pencil, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvestmentGoalModal } from '@/components/mes/InvestmentGoalModal'
import { formatCurrency } from '@/utils/format'

interface InvestmentGoalSectionProps {
  investmentGoal: number
  available: number
  freeMoney: number
  onUpdate: (amount: number) => void
}

export function InvestmentGoalSection({
  investmentGoal,
  available,
  freeMoney,
  onUpdate,
}: InvestmentGoalSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-violet-50/50 to-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Objetivo de inversión</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Cuánto destinar a invertir del disponible
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setModalOpen(true)}>
            <Pencil className="size-3.5" />
            Definir
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Objetivo" value={formatCurrency(investmentGoal)} />
          <Metric label="Disponible" value={formatCurrency(available)} />
          <Metric
            label="Dinero libre"
            value={formatCurrency(freeMoney)}
            variant={freeMoney < 0 ? 'danger' : 'success'}
          />
        </div>
      </div>

      <InvestmentGoalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentGoal={investmentGoal}
        available={available}
        onSubmit={onUpdate}
      />
    </>
  )
}

function Metric({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: string
  variant?: 'default' | 'success' | 'danger'
}) {
  return (
    <div className="rounded-xl bg-background/60 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={
          variant === 'danger'
            ? 'mt-0.5 text-sm font-semibold tabular-nums text-red-600'
            : variant === 'success'
              ? 'mt-0.5 text-sm font-semibold tabular-nums text-teal-600'
              : 'mt-0.5 text-sm font-semibold tabular-nums'
        }
      >
        {value}
      </p>
    </div>
  )
}
