import { ArrowDownCircle, Calculator, TrendingUp, Wallet } from 'lucide-react'
import type { AnalysisHighlights } from '@/types/analytics'
import { AnalysisStatCard } from '@/components/analisis/AnalysisStatCard'
import { formatCurrency } from '@/utils/format'

interface AnalysisHighlightsRowProps {
  highlights: AnalysisHighlights
}

export function AnalysisHighlightsRow({ highlights }: AnalysisHighlightsRowProps) {
  const { monthlyAverage, topIncome, topObligation, topDestination } = highlights

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AnalysisStatCard
        title="Promedio mensual"
        value={formatCurrency(monthlyAverage.income)}
        subtitle={`Dinero libre prom.: ${formatCurrency(monthlyAverage.freeMoney)}`}
        icon={Calculator}
        iconBg="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      />
      <AnalysisStatCard
        title="Mayor ingreso"
        value={formatCurrency(topIncome.amount)}
        subtitle={`${topIncome.description} · ${topIncome.type}`}
        icon={Wallet}
        accent="text-emerald-600 dark:text-emerald-300"
        iconBg="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
      />
      <AnalysisStatCard
        title="Mayor obligación"
        value={formatCurrency(topObligation.amount)}
        subtitle={`${topObligation.name} · ${topObligation.category}`}
        icon={ArrowDownCircle}
        accent="text-amber-600 dark:text-amber-300"
        iconBg="bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
      />
      <AnalysisStatCard
        title="Reserva prom."
        value={formatCurrency(monthlyAverage.reserved)}
        subtitle={
          topDestination
            ? `Mayor destino: ${topDestination.name}`
            : `Obligaciones prom.: ${formatCurrency(monthlyAverage.obligations)}`
        }
        icon={TrendingUp}
        accent="text-violet-600 dark:text-violet-300"
        iconBg="bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300"
      />
    </div>
  )
}
