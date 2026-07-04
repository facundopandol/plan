import {
  ArrowDownCircle,
  Banknote,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard'
import { MonthSummary } from '@/components/dashboard/MonthSummary'
import { UpcomingDueDates } from '@/components/dashboard/UpcomingDueDates'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-40 rounded-2xl bg-muted/40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/40" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-muted/40" />
        <div className="h-80 rounded-2xl bg-muted/40" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const { summary, obligations } = data

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <section aria-label="Indicadores principales">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <DashboardStatCard
            title="Ingreso"
            value={summary.income}
            icon={Wallet}
            variant="income"
            description="Total planificado del mes"
          />
          <DashboardStatCard
            title="Obligaciones"
            value={summary.obligations}
            icon={ArrowDownCircle}
            variant="obligation"
            description="Compromisos fijos y variables"
          />
          <DashboardStatCard
            title="Disponible"
            value={summary.available}
            icon={Banknote}
            variant="available"
            description="Lo que queda después de obligaciones"
            featured
          />
          <DashboardStatCard
            title="Objetivo de inversión"
            value={summary.investmentGoal}
            icon={TrendingUp}
            variant="investment"
            description="Meta mensual de inversión"
          />
          <DashboardStatCard
            title="Dinero libre"
            value={summary.freeMoney}
            icon={PiggyBank}
            variant="free"
            description="Para vivir sin restricciones"
          />
        </div>
      </section>

      <section
        aria-label="Resumen y vencimientos"
        className="grid gap-6 lg:grid-cols-2 lg:items-start"
      >
        <MonthSummary summary={summary} />
        <UpcomingDueDates obligations={obligations} />
      </section>
    </div>
  )
}
