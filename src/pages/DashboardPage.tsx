import {
  ArrowDownCircle,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard'
import { UpcomingDueDates } from '@/components/dashboard/UpcomingDueDates'
import { useDashboardSummary } from '@/hooks/useDashboardSummary'

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

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <section aria-label="Indicadores principales">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            title="Ingresos"
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
            description="Compromisos del mes"
          />
          <DashboardStatCard
            title="Ahorro / Inversión"
            value={summary.investmentGoal}
            icon={TrendingUp}
            variant="investment"
            description="Reserva que decidiste apartar"
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

      <section aria-label="Próximos vencimientos">
        <UpcomingDueDates obligations={obligations} />
      </section>
    </div>
  )
}
