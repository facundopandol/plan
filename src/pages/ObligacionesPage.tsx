import {
  CurrencyCell,
  DataTable,
  DateCell,
  PaidBadge,
} from '@/components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { formatCurrency } from '@/utils/format'

export function ObligacionesPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando obligaciones...</p>
      </div>
    )
  }

  const { obligations } = data
  const total = obligations.reduce((sum, o) => sum + o.amount, 0)
  const pending = obligations.filter((o) => !o.paid).reduce((sum, o) => sum + o.amount, 0)

  return (
    <div>
      <PageHeader
        title="Obligaciones"
        description="Compromisos financieros del mes, no gastos diarios."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total obligaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendiente de pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-amber-600">
              {formatCurrency(pending)}
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        headers={['Nombre', 'Categoría', 'Vencimiento', 'Monto', 'Estado']}
        rows={obligations.map((o) => [o.name, o.category, o.dueDate, o.amount, o.paid])}
        formatters={{
          2: (v) => <DateCell value={v as string} />,
          3: (v) => <CurrencyCell value={v as number} />,
          4: (v) => <PaidBadge paid={v as boolean} />,
        }}
      />
    </div>
  )
}
