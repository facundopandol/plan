import { PageHeader } from '@/components/PageHeader'
import { IncomeSection } from '@/components/mes/IncomeSection'
import { ObligationSection } from '@/components/mes/ObligationSection'
import { PlanFlow } from '@/components/mes/PlanFlow'
import { useMesPlanState } from '@/hooks/useMesPlanState'

function MesPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 rounded-2xl bg-muted/40" />
      <div className="h-64 rounded-2xl bg-muted/40" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-muted/40" />
        <div className="h-64 rounded-2xl bg-muted/40" />
      </div>
    </div>
  )
}

export function MesPage() {
  const {
    isLoading,
    incomes,
    obligations,
    investmentGoal,
    summary,
    setInvestmentGoal,
    addIncome,
    updateIncome,
    removeIncome,
    addObligation,
    updateObligation,
    removeObligation,
  } = useMesPlanState()

  if (isLoading) {
    return <MesPageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planificar mes"
        description="Organizá ingresos, obligaciones y cuánto reservar para ahorro e inversiones."
      />

      <PlanFlow
        summary={summary}
        savedSavingsInvestment={investmentGoal}
        onSaveSavingsInvestment={setInvestmentGoal}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeSection
          incomes={incomes}
          onAdd={addIncome}
          onUpdate={updateIncome}
          onRemove={removeIncome}
        />
        <ObligationSection
          obligations={obligations}
          onAdd={addObligation}
          onUpdate={updateObligation}
          onRemove={removeObligation}
        />
      </div>
    </div>
  )
}
