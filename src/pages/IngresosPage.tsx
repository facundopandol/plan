import {
  CurrencyCell,
  DataTable,
  RecurringBadge,
} from '@/components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { formatCurrency } from '@/utils/format'

export function IngresosPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando ingresos...</p>
      </div>
    )
  }

  const { incomes } = data
  const total = incomes.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <PageHeader
        title="Ingresos"
        description="Fuentes de ingreso planificadas para el mes."
      />

      <Card className="mb-6 border-border/60 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de ingresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
        </CardContent>
      </Card>

      <DataTable
        headers={['Nombre', 'Categoría', 'Monto', 'Tipo']}
        rows={incomes.map((i) => [i.name, i.category, i.amount, i.recurring])}
        formatters={{
          2: (v) => <CurrencyCell value={v as number} />,
          3: (v) => <RecurringBadge recurring={v as boolean} />,
        }}
      />
    </div>
  )
}
