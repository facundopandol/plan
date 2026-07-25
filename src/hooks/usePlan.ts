import { useMemo } from 'react'
import { usePlan } from '@/context/PlanContext'
import type { MonthlySummary, Obligation } from '@/types'
import { getMonthFromDate } from '@/utils/date'
import {
  fixedObligationToMonthView,
  getActiveMonthlyFixedObligations,
  sumActiveMonthlyFixedObligations,
} from '@/utils/obligationMappers'

export { usePlan } from '@/context/PlanContext'

export function useSelectedMonth() {
  const { selectedMonth, setSelectedMonth } = usePlan()
  return { selectedMonth, setSelectedMonth }
}

export function useSettings() {
  const { settings, saveSettings, isSettingsSaved } = usePlan()
  return { settings, saveSettings, isSaved: isSettingsSaved }
}

export function useMonthOptions() {
  const { monthOptions } = usePlan()
  return monthOptions
}

export function useIncomeActions() {
  const plan = usePlan()
  return {
    getEntriesForMonth: plan.getIncomeEntriesForMonth,
    getMonthlyTotal: plan.getIncomeMonthlyTotal,
    addIncome: plan.addIncome,
    updateIncome: plan.updateIncome,
    removeIncome: plan.removeIncome,
  }
}

export function useInvestmentActions() {
  const { investments, addInvestment, updateInvestment, removeInvestment } = usePlan()
  return { investments, addInvestment, updateInvestment, removeInvestment }
}

export function useGoals() {
  const { goals, addGoal, updateGoal, removeGoal } = usePlan()
  return { goals, addGoal, updateGoal, removeGoal }
}

export function useFixedObligationsData() {
  const { fixedObligations, addFixedObligation, updateFixedObligation, removeFixedObligation } =
    usePlan()
  return {
    obligations: fixedObligations,
    addObligation: addFixedObligation,
    updateObligation: updateFixedObligation,
    removeObligation: removeFixedObligation,
  }
}

export function useDashboardSummary() {
  const plan = usePlan()
  const {
    selectedMonth,
    isLoading,
    getIncomeMonthlyTotal,
    fixedObligations,
    investments,
  } = plan

  // Misma fuente que la página Obligaciones: fijas mensuales activas.
  // No mezclar con filas legacy is_fixed=false del mes (duplicaban alquiler, etc.).
  const obligations = useMemo<Obligation[]>(
    () =>
      getActiveMonthlyFixedObligations(fixedObligations).map((item) =>
        fixedObligationToMonthView(item),
      ),
    [fixedObligations],
  )

  const summary = useMemo<MonthlySummary>(() => {
    const income = getIncomeMonthlyTotal(selectedMonth)
    const obligationsTotal = sumActiveMonthlyFixedObligations(fixedObligations)
    // Misma fuente que Ahorro e Inversiones: suma de lo cargado en el mes.
    const investmentGoal = investments
      .filter((entry) => getMonthFromDate(entry.date) === selectedMonth)
      .reduce((sum, entry) => sum + entry.amount, 0)
    const available = income - obligationsTotal
    const freeMoney = available - investmentGoal

    return {
      income,
      obligations: obligationsTotal,
      available,
      investmentGoal,
      freeMoney,
    }
  }, [selectedMonth, getIncomeMonthlyTotal, fixedObligations, investments])

  return {
    summary,
    obligations,
    isLoading,
  }
}
