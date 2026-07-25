import { describe, expect, it } from 'vitest'
import { buildAnalyticsFromPlan } from '@/services/analyticsService'
import type { PlanState } from '@/services/planApi'

function makeState(overrides: Partial<PlanState> = {}): PlanState {
  return {
    userId: 'user-1',
    settings: {
      name: 'Facundo',
      currency: 'ARS',
      locale: 'es-AR',
      monthlySavingsGoal: 100_000,
      monthlyInvestmentGoal: 50_000,
      primaryColor: 'emerald',
      darkMode: false,
    },
    monthOptions: [
      { value: '2026-06', label: 'Junio 2026' },
      { value: '2026-07', label: 'Julio 2026' },
    ],
    incomes: [
      {
        id: 'inc-1',
        date: '2026-07-01',
        type: 'Sueldo',
        description: 'Sueldo',
        amount: 1_000_000,
      },
    ],
    fixedObligations: [
      {
        id: 'ob-1',
        name: 'Alquiler',
        category: 'Alquiler',
        amount: 300_000,
      },
      {
        id: 'ob-2',
        name: 'Internet',
        category: 'Servicios',
        amount: 25_000,
      },
    ],
    goals: [],
    investments: [
      {
        id: 'inv-1',
        date: '2026-07-05',
        type: 'Inversión',
        amount: 100_000,
      },
    ],
    ...overrides,
  }
}

describe('buildAnalyticsFromPlan', () => {
  it('usa las mismas obligaciones que el Dashboard', () => {
    const data = buildAnalyticsFromPlan(makeState(), '2026-07')
    const july = data.evolution.find((point) => point.month === '2026-07')

    expect(july?.obligations).toBe(325_000)
    expect(july?.income).toBe(1_000_000)
    expect(july?.reserved).toBe(100_000)
    expect(july?.freeMoney).toBe(575_000)
    expect(data.highlights.topObligation.name).toBe('Alquiler')
    expect(data.topCategories[0]?.category).toBe('Alquiler')
  })
})
