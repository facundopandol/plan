import type { AnalyticsData, CategoryRanking, MonthlyEvolutionPoint } from '@/types/analytics'
import type { PlanState } from '@/services/planApi'
import { getMonthFromDate } from '@/utils/date'
import { getMonthLabelFromOptions } from '@/utils/month'
import { computeDestinationDistribution, getDestinationLabel } from '@/utils/investment'
import {
  fixedObligationToMonthView,
  sumFixedObligations,
} from '@/utils/obligationMappers'

export function buildAnalyticsFromPlan(
  state: PlanState,
  selectedMonth?: string,
): AnalyticsData {
  // Misma fuente que Dashboard / Obligaciones.
  const obligationsTotal = sumFixedObligations(state.fixedObligations)
  const monthObligations = state.fixedObligations.map(fixedObligationToMonthView)

  const evolution: MonthlyEvolutionPoint[] = state.monthOptions
    .slice()
    .sort((a, b) => a.value.localeCompare(b.value))
    .map((option) => {
      const income = state.incomes
        .filter((entry) => getMonthFromDate(entry.date) === option.value)
        .reduce((sum, entry) => sum + entry.amount, 0)
      const reserved = state.investments
        .filter((entry) => getMonthFromDate(entry.date) === option.value)
        .reduce((sum, entry) => sum + entry.amount, 0)
      const freeMoney = income - obligationsTotal - reserved

      return {
        month: option.value,
        label: getMonthLabelFromOptions(state.monthOptions, option.value).slice(0, 3),
        freeMoney: Math.max(freeMoney, 0),
        income,
        obligations: obligationsTotal,
        reserved,
      }
    })

  const focusMonth = selectedMonth || state.monthOptions[0]?.value
  const monthEntries = state.investments.filter(
    (entry) => getMonthFromDate(entry.date) === focusMonth,
  )

  const savingsDistribution = computeDestinationDistribution(monthEntries, state.goals)

  const categoryTotals = new Map<string, number>()
  for (const obligation of monthObligations) {
    categoryTotals.set(
      obligation.category,
      (categoryTotals.get(obligation.category) ?? 0) + obligation.amount,
    )
  }

  const totalCategoryAmount = Array.from(categoryTotals.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  )
  const topCategories: CategoryRanking[] = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalCategoryAmount > 0 ? Math.round((amount / totalCategoryAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  const goalProgress = state.goals
    .map((goal) => ({
      id: goal.id,
      name: goal.name,
      savedAmount: goal.savedAmount,
      targetAmount: goal.targetAmount,
      percentage:
        goal.targetAmount > 0
          ? Math.round((goal.savedAmount / goal.targetAmount) * 100)
          : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  const monthCount = Math.max(evolution.length, 1)
  const monthlyAverage = {
    income: evolution.reduce((sum, point) => sum + point.income, 0) / monthCount,
    obligations: obligationsTotal,
    freeMoney: evolution.reduce((sum, point) => sum + point.freeMoney, 0) / monthCount,
    reserved: evolution.reduce((sum, point) => sum + point.reserved, 0) / monthCount,
  }

  const topIncome = state.incomes.reduce(
    (best, entry) => (entry.amount > best.amount ? entry : best),
    state.incomes[0] ?? {
      description: '—',
      amount: 0,
      type: 'Otro' as const,
      id: '',
      date: '',
    },
  )

  const topObligation = monthObligations.reduce(
    (best, item) => (item.amount > best.amount ? item : best),
    monthObligations[0] ?? { name: '—', amount: 0, category: 'Otro', id: '' },
  )

  const topDestination = monthEntries.reduce(
    (best, entry) => (entry.amount > best.amount ? entry : best),
    monthEntries[0],
  )

  return {
    evolution,
    topCategories,
    savingsDistribution,
    goalProgress,
    highlights: {
      monthlyAverage,
      topIncome: {
        description: topIncome.description,
        amount: topIncome.amount,
        type: topIncome.type,
      },
      topObligation: {
        name: topObligation.name,
        amount: topObligation.amount,
        category: topObligation.category,
      },
      topDestination: topDestination
        ? {
            name: getDestinationLabel(topDestination, state.goals),
            amount: topDestination.amount,
          }
        : undefined,
    },
  }
}
