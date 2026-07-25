import type {
  FixedObligation,
  IncomeEntry,
  InvestmentEntry,
  MonthOption,
  SavingsGoal,
  UserSettings,
} from '@/types'
import { ApiError, apiClient } from '@/lib/api/client'
import {
  fixedObligationToApi,
  incomeEntryToApi,
  investmentEntryToApi,
  mapGoal,
  mapIncomeToEntry,
  mapInvestment,
  mapMonthToOption,
  mapObligationToFixed,
  mapSettingsToUserUpdate,
  mapUserToSettings,
  savingsGoalToApi,
} from '@/services/api/mappers'
import type {
  ApiGoal,
  ApiIncome,
  ApiInvestment,
  ApiMonth,
  ApiObligation,
  ApiUser,
  PaginatedResponse,
} from '@/services/api/types'
import { getDefaultMonthOptions } from '@/utils/month'

export interface PlanState {
  userId: string
  settings: UserSettings
  monthOptions: MonthOption[]
  incomes: IncomeEntry[]
  fixedObligations: FixedObligation[]
  goals: SavingsGoal[]
  investments: InvestmentEntry[]
}

export function createEmptyPlanState(): PlanState {
  const monthOptions = getDefaultMonthOptions()

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
    incomes: [],
    fixedObligations: [],
    goals: [],
    investments: [],
  }
}

async function fetchAll<T>(path: string, params?: Record<string, unknown>): Promise<T[]> {
  const { data } = await apiClient.get<PaginatedResponse<T>>(path, {
    params: { limit: 500, ...params },
  })
  return data.items
}

export const planApi = {
  async loadInitialState(): Promise<PlanState> {
    const [users, months, incomes, obligations, investments, goals] = await Promise.all([
      fetchAll<ApiUser>('/users'),
      fetchAll<ApiMonth>('/months'),
      fetchAll<ApiIncome>('/incomes'),
      fetchAll<ApiObligation>('/obligations'),
      fetchAll<ApiInvestment>('/investments'),
      fetchAll<ApiGoal>('/goals'),
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

    return {
      userId: user.id,
      settings: mapUserToSettings(user),
      monthOptions,
      incomes: incomes.filter((item) => !item.is_plan_item).map(mapIncomeToEntry),
      fixedObligations: obligations.filter((item) => item.is_fixed).map(mapObligationToFixed),
      goals: goals.map(mapGoal),
      investments: investments.map(mapInvestment),
    }
  },

  async updateSettings(userId: string, settings: UserSettings): Promise<UserSettings> {
    const id = userId.trim()
    if (!id) {
      throw new ApiError('No se encontró el usuario. Recargá la página e intentá de nuevo.', {
        status: 400,
      })
    }
    const { data } = await apiClient.put<ApiUser>(`/users/${id}`, mapSettingsToUserUpdate(settings))
    return mapUserToSettings(data)
  },

  async resolveUserId(): Promise<string> {
    const users = await fetchAll<ApiUser>('/users')
    const id = users[0]?.id?.trim()
    if (!id) {
      throw new ApiError('No hay usuario configurado. Verificá que el backend esté en ejecución.', {
        status: 400,
      })
    }
    return id
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

}

export type { PlanState as PlanInitialState }
