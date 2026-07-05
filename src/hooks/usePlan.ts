import { useMemo } from 'react'
import { usePlan } from '@/context/PlanContext'
import type { Income, MonthlySummary, Obligation } from '@/types'
import {
  incomeEntryToPlanIncome,
  planIncomeToNewEntry,
  planIncomeToUpdatedEntry,
} from '@/utils/incomeMappers'
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

export function useMonthPlanState() {
  const plan = usePlan()
  const {
    selectedMonth,
    isLoading,
    incomes: globalIncomes,
    fixedObligations,
    getMonthPlan,
    getIncomeEntriesForMonth,
    getIncomeMonthlyTotal,
  } = plan
  const monthPlan = getMonthPlan(selectedMonth)
  const monthEntries = getIncomeEntriesForMonth(selectedMonth)

  const incomes = useMemo<Income[]>(() => {
    const fromRegister = monthEntries.map(incomeEntryToPlanIncome)
    const planOnly = (monthPlan?.incomes ?? []).filter(
      (item) => !fromRegister.some((entry) => entry.id === item.id),
    )
    return [...fromRegister, ...planOnly]
  }, [monthEntries, monthPlan?.incomes])

  const obligations = useMemo<Obligation[]>(() => {
    const monthOnly = monthPlan?.obligations ?? []
    const fromFixed = getActiveMonthlyFixedObligations(fixedObligations)
      .map((item) => fixedObligationToMonthView(item, selectedMonth))
      .filter((item) => !monthOnly.some((entry) => entry.id === item.id))
    return [...monthOnly, ...fromFixed]
  }, [fixedObligations, monthPlan?.obligations, selectedMonth])

  const summary = useMemo<MonthlySummary>(() => {
    const income =
      getIncomeMonthlyTotal(selectedMonth) +
      (monthPlan?.incomes ?? [])
        .filter((item) => !monthEntries.some((entry) => entry.id === item.id))
        .reduce((sum, item) => sum + item.amount, 0)
    const obligationsTotal =
      (monthPlan?.obligations.reduce((sum, o) => sum + o.amount, 0) ?? 0) +
      sumActiveMonthlyFixedObligations(fixedObligations)
    const investmentGoal = monthPlan?.investmentGoal ?? 0
    const available = income - obligationsTotal
    const freeMoney = available - investmentGoal

    return {
      income,
      obligations: obligationsTotal,
      available,
      investmentGoal,
      freeMoney,
    }
  }, [monthPlan, selectedMonth, getIncomeMonthlyTotal, monthEntries, fixedObligations])

  const isGlobalIncome = (id: string) => globalIncomes.some((entry) => entry.id === id)
  const isFixedObligation = (id: string) => fixedObligations.some((entry) => entry.id === id)

  return {
    isLoading,
    incomes,
    obligations,
    investmentGoal: monthPlan?.investmentGoal ?? 0,
    summary,
    setInvestmentGoal: (amount: number) => plan.setMonthInvestmentGoal(selectedMonth, amount),
    addIncome: (income: Income) => {
      plan.addIncome(planIncomeToNewEntry(income, selectedMonth))
    },
    updateIncome: (income: Income) => {
      if (isGlobalIncome(income.id)) {
        const existing = globalIncomes.find((entry) => entry.id === income.id)
        if (existing) {
          plan.updateIncome(planIncomeToUpdatedEntry(income, existing))
        }
        return
      }
      plan.updateMonthIncome(selectedMonth, income)
    },
    removeIncome: (id: string) => {
      if (isGlobalIncome(id)) {
        plan.removeIncome(id)
        return
      }
      plan.removeMonthIncome(selectedMonth, id)
    },
    addObligation: (obligation: Parameters<typeof plan.addMonthObligation>[1]) =>
      plan.addMonthObligation(selectedMonth, obligation),
    updateObligation: (obligation: Parameters<typeof plan.updateMonthObligation>[1]) => {
      if (isFixedObligation(obligation.id)) {
        const existing = fixedObligations.find((entry) => entry.id === obligation.id)
        if (existing) {
          plan.updateFixedObligation({
            ...existing,
            name: obligation.name,
            amount: obligation.amount,
            category: obligation.name,
          })
        }
        return
      }
      plan.updateMonthObligation(selectedMonth, obligation)
    },
    removeObligation: (id: string) => {
      if (isFixedObligation(id)) {
        plan.removeFixedObligation(id)
        return
      }
      plan.removeMonthObligation(selectedMonth, id)
    },
  }
}

export function useDashboardSummary() {
  const plan = usePlan()
  const { selectedMonth, isLoading, getMonthPlan, getIncomeMonthlyTotal, fixedObligations } = plan
  const monthPlan = getMonthPlan(selectedMonth)

  const obligations = useMemo<Obligation[]>(() => {
    const monthOnly = monthPlan?.obligations ?? []
    const fromFixed = getActiveMonthlyFixedObligations(fixedObligations)
      .map((item) => fixedObligationToMonthView(item, selectedMonth))
      .filter((item) => !monthOnly.some((entry) => entry.id === item.id))
    return [...monthOnly, ...fromFixed]
  }, [fixedObligations, monthPlan?.obligations, selectedMonth])

  const summary = useMemo<MonthlySummary>(() => {
    const income = getIncomeMonthlyTotal(selectedMonth)
    const obligationsTotal =
      (monthPlan?.obligations.reduce((sum, o) => sum + o.amount, 0) ?? 0) +
      sumActiveMonthlyFixedObligations(fixedObligations)
    const investmentGoal = monthPlan?.investmentGoal ?? 0
    const available = income - obligationsTotal
    const freeMoney = available - investmentGoal

    return {
      income,
      obligations: obligationsTotal,
      available,
      investmentGoal,
      freeMoney,
    }
  }, [monthPlan, selectedMonth, getIncomeMonthlyTotal, fixedObligations])

  return {
    summary,
    obligations,
    isLoading,
  }
}
