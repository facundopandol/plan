import type { Income, Obligation } from '@/types'

export function calculateSummary(
  incomes: Income[],
  obligations: Obligation[],
  investmentGoal: number,
) {
  const income = incomes.reduce((sum, item) => sum + item.amount, 0)
  const obligationsTotal = obligations.reduce((sum, item) => sum + item.amount, 0)
  const available = income - obligationsTotal
  const freeMoney = available - investmentGoal

  return {
    income,
    obligations: obligationsTotal,
    available,
    investmentGoal,
    freeMoney,
  }
}

export function generateId(): string {
  return crypto.randomUUID()
}
