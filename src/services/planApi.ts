import type {
  FixedObligation,
  Income,
  IncomeEntry,
  InvestmentEntry,
  MonthOption,
  MonthPlanState,
  Obligation,
  SavingsGoal,
  UserSettings,
  ObligationTypeOption,
} from '@/types'
import { DEFAULT_OBLIGATION_TYPES } from '@/schemas/obligacionSchemas'
import { ApiError, apiClient } from '@/lib/api/client'
import {
  buildMonthPlans,
  fixedObligationToApi,
  incomeEntryToApi,
  investmentEntryToApi,
  mapGoal,
  mapIncomeToEntry,
  mapIncomeToPlanItem,
  mapInvestment,
  mapMonthToOption,
  mapObligationToFixed,
  mapObligationToMonth,
  mapSettingsToUserUpdate,
  mapUserToSettings,
  monthObligationToApi,
  planIncomeToApi,
  savingsGoalToApi,
  mapObligationType,
} from '@/services/api/mappers'
import type {
  ApiCategory,
  ApiGoal,
  ApiIncome,
  ApiInvestment,
  ApiMonth,
  ApiObligation,
  ApiUser,
  PaginatedResponse,
} from '@/services/api/types'
import { formatMonthLabel, getDefaultMonthOptions } from '@/utils/month'

export interface PlanState {
  userId: string
  settings: UserSettings
  monthOptions: MonthOption[]
  monthIdMap: Record<string, string>
  incomes: IncomeEntry[]
  fixedObligations: FixedObligation[]
  goals: SavingsGoal[]
  investments: InvestmentEntry[]
  monthPlans: Record<string, MonthPlanState>
  obligationTypes: ObligationTypeOption[]
}

export function createEmptyPlanState(): PlanState {
  const monthOptions = getDefaultMonthOptions()
  const monthPlans: Record<string, MonthPlanState> = {}

  for (const option of monthOptions) {
    monthPlans[option.value] = { incomes: [], obligations: [], investmentGoal: 0 }
  }

  return {
    userId: '',
    settings: {
      name: '',
      currency: 'ARS',
      locale: 'es-AR',
      monthlySavingsGoal: 0,
      monthlyInvestmentGoal: 0,
      primaryColor: 'zinc',
      darkMode: false,
    },
    monthOptions,
    monthIdMap: {},
    incomes: [],
    fixedObligations: [],
    goals: [],
    investments: [],
    monthPlans,
    obligationTypes: [],
  }
}

async function fetchAll<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
  const { data } = await apiClient.get<PaginatedResponse<T>>(path, {
    params: { limit: 500, ...params },
  })
  return data.items
}

async function loadObligationTypes(): Promise<ObligationTypeOption[]> {
  let categories = await fetchAll<ApiCategory>('/categories', { kind: 'obligation' })

  if (categories.length === 0) {
    await Promise.all(
      DEFAULT_OBLIGATION_TYPES.map((name) =>
        apiClient.post<ApiCategory>('/categories', { name, kind: 'obligation' }),
      ),
    )
    categories = await fetchAll<ApiCategory>('/categories', { kind: 'obligation' })
  }

  return categories.map(mapObligationType)
}

export const planApi = {
  async loadInitialState(): Promise<PlanState> {
    const [users, months, incomes, obligations, investments, goals, obligationTypes] =
      await Promise.all([
      fetchAll<ApiUser>('/users'),
      fetchAll<ApiMonth>('/months'),
      fetchAll<ApiIncome>('/incomes'),
      fetchAll<ApiObligation>('/obligations'),
      fetchAll<ApiInvestment>('/investments'),
      fetchAll<ApiGoal>('/goals'),
      loadObligationTypes(),
    ])

    const user = users[0]
    if (!user) {
      throw new Error('No hay usuario configurado. Ejecutá las migraciones del backend.')
    }

    const monthOptions =
      months.length > 0
        ? months
            .slice()
            .sort((a, b) => b.year_month.localeCompare(a.year_month))
            .map(mapMonthToOption)
        : getDefaultMonthOptions()

    const monthIdMap = Object.fromEntries(months.map((month) => [month.year_month, month.id]))
    const monthPlans = buildMonthPlans(months, incomes, obligations)

    for (const option of monthOptions) {
      if (!monthPlans[option.value]) {
        monthPlans[option.value] = { incomes: [], obligations: [], investmentGoal: 0 }
      }
    }

    return {
      userId: user.id,
      settings: mapUserToSettings(user),
      monthOptions,
      monthIdMap,
      incomes: incomes.filter((item) => !item.is_plan_item).map(mapIncomeToEntry),
      fixedObligations: obligations.filter((item) => item.is_fixed).map(mapObligationToFixed),
      goals: goals.map(mapGoal),
      investments: investments.map(mapInvestment),
      monthPlans,
      obligationTypes,
    }
  },

  async updateSettings(userId: string, settings: UserSettings): Promise<UserSettings> {
    const { data } = await apiClient.put<ApiUser>(`/users/${userId}`, mapSettingsToUserUpdate(settings))
    return mapUserToSettings(data)
  },

  async ensureMonth(yearMonth: string, monthIdMap: Record<string, string>): Promise<string> {
    if (monthIdMap[yearMonth]) return monthIdMap[yearMonth]

    try {
      const { data } = await apiClient.post<ApiMonth>('/months', {
        year_month: yearMonth,
        label: formatMonthLabel(yearMonth),
        investment_goal: 0,
      })
      return data.id
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const months = await fetchAll<ApiMonth>('/months')
        const existing = months.find((month) => month.year_month === yearMonth)
        if (existing) return existing.id
      }
      throw error
    }
  },

  async createIncome(entry: Omit<IncomeEntry, 'id'>): Promise<IncomeEntry> {
    const { data } = await apiClient.post<ApiIncome>('/incomes', incomeEntryToApi(entry))
    return mapIncomeToEntry(data)
  },

  async updateIncome(entry: IncomeEntry): Promise<IncomeEntry> {
    const { data } = await apiClient.put<ApiIncome>(`/incomes/${entry.id}`, incomeEntryToApi(entry))
    return mapIncomeToEntry(data)
  },

  async deleteIncome(id: string): Promise<void> {
    await apiClient.delete(`/incomes/${id}`)
  },

  async createFixedObligation(entry: Omit<FixedObligation, 'id'>): Promise<FixedObligation> {
    const { data } = await apiClient.post<ApiObligation>('/obligations', fixedObligationToApi(entry))
    return mapObligationToFixed(data)
  },

  async updateFixedObligation(entry: FixedObligation): Promise<FixedObligation> {
    const { data } = await apiClient.put<ApiObligation>(`/obligations/${entry.id}`, {
      ...fixedObligationToApi(entry),
    })
    return mapObligationToFixed(data)
  },

  async deleteFixedObligation(id: string): Promise<void> {
    await apiClient.delete(`/obligations/${id}`)
  },

  async createGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
    const { data } = await apiClient.post<ApiGoal>('/goals', savingsGoalToApi(goal))
    return mapGoal(data)
  },

  async updateGoal(goal: SavingsGoal): Promise<SavingsGoal> {
    const { data } = await apiClient.put<ApiGoal>(`/goals/${goal.id}`, savingsGoalToApi(goal))
    return mapGoal(data)
  },

  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`)
  },

  async createInvestment(entry: Omit<InvestmentEntry, 'id'>): Promise<InvestmentEntry> {
    const { data } = await apiClient.post<ApiInvestment>('/investments', investmentEntryToApi(entry))
    return mapInvestment(data)
  },

  async updateInvestment(entry: InvestmentEntry): Promise<InvestmentEntry> {
    const { data } = await apiClient.put<ApiInvestment>(
      `/investments/${entry.id}`,
      investmentEntryToApi(entry),
    )
    return mapInvestment(data)
  },

  async deleteInvestment(id: string): Promise<void> {
    await apiClient.delete(`/investments/${id}`)
  },

  async updateMonthInvestmentGoal(
    yearMonth: string,
    monthId: string,
    amount: number,
    label: string,
  ): Promise<void> {
    await apiClient.put(`/months/${monthId}`, {
      year_month: yearMonth,
      label,
      investment_goal: amount,
    })
  },

  async createMonthIncome(monthId: string, income: Omit<Income, 'id'>): Promise<Income> {
    const { data } = await apiClient.post<ApiIncome>('/incomes', planIncomeToApi(income, monthId))
    return mapIncomeToPlanItem(data)
  },

  async updateMonthIncome(income: Income, monthId: string): Promise<Income> {
    const { data } = await apiClient.put<ApiIncome>(`/incomes/${income.id}`, {
      ...planIncomeToApi(income, monthId),
    })
    return mapIncomeToPlanItem(data)
  },

  async deleteMonthIncome(id: string): Promise<void> {
    await apiClient.delete(`/incomes/${id}`)
  },

  async createMonthObligation(monthId: string, obligation: Omit<Obligation, 'id'>): Promise<Obligation> {
    const { data } = await apiClient.post<ApiObligation>(
      '/obligations',
      monthObligationToApi(obligation, monthId),
    )
    return mapObligationToMonth(data)
  },

  async updateMonthObligation(obligation: Obligation, monthId: string): Promise<Obligation> {
    const { data } = await apiClient.put<ApiObligation>(`/obligations/${obligation.id}`, {
      ...monthObligationToApi(obligation, monthId),
    })
    return mapObligationToMonth(data)
  },

  async deleteMonthObligation(id: string): Promise<void> {
    await apiClient.delete(`/obligations/${id}`)
  },

  async createObligationType(name: string): Promise<ObligationTypeOption> {
    const { data } = await apiClient.post<ApiCategory>('/categories', {
      name,
      kind: 'obligation',
    })
    return mapObligationType(data)
  },

  async deleteObligationType(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`)
  },
}

export type { PlanState as PlanInitialState }
