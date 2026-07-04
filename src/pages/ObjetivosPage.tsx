import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useMonthlyPlan } from '@/hooks/useMonthlyPlan'
import { formatCurrency, formatDate } from '@/utils/format'

export function ObjetivosPage() {
  const { data, isLoading } = useMonthlyPlan()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando objetivos...</p>
      </div>
    )
  }

  const { goals } = data

  return (
    <div>
      <PageHeader
        title="Objetivos"
        description="Metas financieras a mediano y largo plazo."
      />

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100)

          return (
            <Card key={goal.id} className="border-border/60 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{goal.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Meta: {formatDate(goal.deadline)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                  </span>
                  <span className="font-medium tabular-nums">
                    Faltan {formatCurrency(goal.targetAmount - goal.currentAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
