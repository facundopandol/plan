import { CurrencyCell, DataTable } from '@/components/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { formatCurrency, formatPercent } from '@/utils/format'

export function InversionesPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando inversiones...</p>
      </div>
    )
  }

  const { investments, summary } = data
  const total = investments.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div>
      <PageHeader
        title="Inversiones"
        description="Asignación de capital para hacer crecer tu patrimonio."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total invertido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Objetivo del mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">
              {formatCurrency(summary.investmentGoal)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {total >= summary.investmentGoal ? 'Objetivo alcanzado' : 'En progreso'}
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        headers={['Nombre', 'Tipo', 'Monto', 'Rendimiento']}
        rows={investments.map((i) => [
          i.name,
          i.type,
          i.amount,
          i.returnRate ? `${formatPercent(i.returnRate)}` : '—',
        ])}
        formatters={{
          2: (v) => <CurrencyCell value={v as number} />,
        }}
      />
    </div>
  )
}
