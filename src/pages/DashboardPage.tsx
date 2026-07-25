import {
  ArrowDownCircle,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard'
import { MonthObligationsSummary } from '@/components/dashboard/MonthObligationsSummary'
import { MonthSetupPrompt } from '@/components/dashboard/MonthSetupPrompt'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'
import { useSettings } from '@/hooks/usePlan'

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-40 rounded-2xl bg-muted/40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/40" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted/40" />
    </div>
  )
}

export function DashboardPage() {
  const { summary, obligations, isLoading } = useDashboardSummary()
  const { settings } = useSettings()
  const reserveGoal = settings.monthlySavingsGoal + settings.monthlyInvestmentGoal
  const needsSetup = summary.income === 0 && summary.obligations === 0

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {needsSetup ? <MonthSetupPrompt /> : null}

      <section aria-label="Indicadores principales">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            title="Ingresos"
            value={summary.income}
            icon={Wallet}
            variant="income"
            description="Total del mes seleccionado"
          />
          <DashboardStatCard
            title="Obligaciones"
            value={summary.obligations}
            icon={ArrowDownCircle}
            variant="obligation"
            description="Compromisos de cada mes"
          />
          <DashboardStatCard
            title="Ahorro / Inversión"
            value={summary.investmentGoal}
            icon={TrendingUp}
            variant="investment"
            description="Capital destinado este mes"
            goal={reserveGoal}
          />
          <DashboardStatCard
            title="Dinero libre"
            value={summary.freeMoney}
            icon={PiggyBank}
            variant="free"
            description="Lo que podés gastar sin afectar tu plan"
            featured
          />
        </div>
      </section>

      <section aria-label="Obligaciones">
        <MonthObligationsSummary obligations={obligations} />
      </section>
    </div>
  )
}
