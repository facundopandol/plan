import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { formatCurrency } from '@/utils/format'

export function MesPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando mes...</p>
      </div>
    )
  }

  const { summary, incomes, obligations } = data
  const paidCount = obligations.filter((o) => o.paid).length
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <PageHeader
        title="Mes"
        description="Resumen detallado de tu planificación mensual."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Balance del mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ingresos totales</span>
              <span className="font-medium tabular-nums">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Obligaciones</span>
              <span className="font-medium tabular-nums text-amber-600">
                -{formatCurrency(summary.obligations)}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Disponible</span>
              <span className="text-lg font-semibold tabular-nums text-blue-600">
                {formatCurrency(summary.available)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Objetivo inversión</span>
              <span className="font-medium tabular-nums">{formatCurrency(summary.investmentGoal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dinero libre</span>
              <span className="font-medium tabular-nums text-emerald-600">
                {formatCurrency(summary.freeMoney)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Estado de obligaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total obligaciones</span>
              <span className="font-medium">{obligations.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pagadas</span>
              <span className="font-medium text-emerald-600">{paidCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pendientes</span>
              <span className="font-medium text-amber-600">{obligations.length - paidCount}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fuentes de ingreso</span>
              <span className="font-medium">{incomes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">% comprometido</span>
              <span className="font-medium">
                {Math.round((summary.obligations / summary.income) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
