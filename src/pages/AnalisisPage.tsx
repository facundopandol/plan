import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useAnalysisMetrics } from '@/hooks/usePlanQueries'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

const trendIcons = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
}

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-muted-foreground',
}

export function AnalisisPage() {
  const { data: metrics, isLoading: metricsLoading } = useAnalysisMetrics()
  const { data: monthData, isLoading: monthLoading } = useMonthlyPlan()

  if (metricsLoading || monthLoading || !metrics || !monthData) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando análisis...</p>
      </div>
    )
  }

  const { summary } = monthData
  const savingsRate = Math.round((summary.freeMoney / summary.income) * 100)
  const obligationRate = Math.round((summary.obligations / summary.income) * 100)

  return (
    <div>
      <PageHeader
        title="Análisis"
        description="Indicadores clave de tu salud financiera mensual."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa de ahorro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{savingsRate}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compromiso de ingreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{obligationRate}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disponible neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(summary.available)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const TrendIcon = trendIcons[metric.trend ?? 'neutral']

          return (
            <Card key={metric.label} className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{metric.value}</p>
                {metric.change && (
                  <div className={cn('mt-1 flex items-center gap-1 text-xs', trendColors[metric.trend ?? 'neutral'])}>
                    <TrendIcon className="size-3" />
                    {metric.change}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
