import { PageHeader } from '@/components/PageHeader'
import { AnalysisHighlightsRow } from '@/components/analisis/AnalysisHighlightsRow'
import { ChartCard } from '@/components/analisis/ChartCard'
import { EvolutionLineChart } from '@/components/analisis/EvolutionLineChart'
import { GoalProgressChart } from '@/components/analisis/GoalProgressChart'
import { MonthlyComparisonChart } from '@/components/analisis/MonthlyComparisonChart'
import { SavingsDistributionChart } from '@/components/analisis/SavingsDistributionChart'
import { TopCategoriesChart } from '@/components/analisis/TopCategoriesChart'
import { useAnalytics } from '@/hooks/useAnalytics'
import { CHART_COLORS } from '@/utils/chart'

function AnalisisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 rounded-2xl bg-muted/40" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/40" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted/40" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 rounded-2xl bg-muted/40" />
        ))}
      </div>
    </div>
  )
}

export function AnalisisPage() {
  const { data, isLoading } = useAnalytics()

  if (isLoading || !data) {
    return <AnalisisSkeleton />
  }

  const { evolution, topCategories, savingsDistribution, goalProgress, highlights } = data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análisis"
        description="Visualizá cómo evoluciona tu planificación financiera mes a mes."
      />

      <AnalysisHighlightsRow highlights={highlights} />

      <ChartCard
        title="Comparación mensual"
        description="Ingresos, obligaciones, reserva y dinero libre"
      >
        <MonthlyComparisonChart data={evolution} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Evolución del dinero libre" description="Lo que podés gastar sin afectar tu plan">
          <EvolutionLineChart data={evolution} dataKey="freeMoney" color={CHART_COLORS.freeMoney} />
        </ChartCard>

        <ChartCard title="Capital reservado por mes" description="Ahorro e inversiones planificados">
          <EvolutionLineChart data={evolution} dataKey="reserved" color={CHART_COLORS.reserved} />
        </ChartCard>

        <ChartCard
          title="Distribución del ahorro"
          description="Destinos del capital reservado en el mes actual"
        >
          <SavingsDistributionChart data={savingsDistribution} />
        </ChartCard>

        <ChartCard title="Progreso de objetivos" description="Avance hacia tus metas de ahorro">
          <GoalProgressChart data={goalProgress} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Evolución de ingresos" description="Total de ingresos por mes">
          <EvolutionLineChart data={evolution} dataKey="income" color={CHART_COLORS.income} />
        </ChartCard>

        <ChartCard title="Evolución de obligaciones" description="Compromisos mensuales">
          <EvolutionLineChart data={evolution} dataKey="obligations" color={CHART_COLORS.obligations} />
        </ChartCard>
      </div>

      <ChartCard
        title="Top categorías"
        description="Obligaciones por categoría en el mes actual"
        className="max-w-2xl"
      >
        <TopCategoriesChart data={topCategories} />
      </ChartCard>
    </div>
  )
}
