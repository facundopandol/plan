import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FixedObligation,
  IncomeEntry,
  InvestmentEntry,
  SavingsGoal,
  UserSettings,
} from '@/types'
import { planKeys } from '@/lib/api/queryKeys'
import { ApiError } from '@/lib/api/client'
import { createEmptyPlanState, planApi, type PlanState } from '@/services/planApi'
import { getMonthFromDate } from '@/utils/date'
import { getDefaultMonthOptions } from '@/utils/month'
import { applyFormatSettings } from '@/utils/format'
import { generateId } from '@/utils/id'
import { applyTheme } from '@/utils/theme'

function patchPlanState(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (state: PlanState) => PlanState,
) {
  queryClient.setQueryData<PlanState>(planKeys.state(), (current) => updater(current ?? createEmptyPlanState()))
}

function ensurePlanState(queryClient: ReturnType<typeof useQueryClient>): PlanState {
  const existing = queryClient.getQueryData<PlanState>(planKeys.state())
  if (existing) return existing

  const empty = createEmptyPlanState()
  queryClient.setQueryData(planKeys.state(), empty)
  return empty
}

function applyGoalDelta(state: PlanState, goalId: string, delta: number): PlanState {
  return {
    ...state,
    goals: state.goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            savedAmount: Math.max(0, Math.min(goal.targetAmount, goal.savedAmount + delta)),
          }
        : goal,
    ),
  }
}

function syncGoalsForInvestmentChange(
  state: PlanState,
  previous: InvestmentEntry | undefined,
  next: InvestmentEntry | undefined,
): PlanState {
  let updated = state
  if (previous?.goalId) {
    updated = applyGoalDelta(updated, previous.goalId, -previous.amount)
  }
  if (next?.goalId) {
    updated = applyGoalDelta(updated, next.goalId, next.amount)
  }
  return updated
}

export function usePlanProvider() {
  const queryClient = useQueryClient()
  const [selectedMonth, setSelectedMonth] = useState('')
  const [isSettingsSaved, setIsSettingsSaved] = useState(false)

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: planKeys.state(),
    queryFn: () => planApi.loadInitialState(),
    // placeholderData: no se persiste como dato "real"; evita guardar con userId vacío
    placeholderData: () => createEmptyPlanState(),
    retry: 2,
    staleTime: 30_000,
  })

  // Aplicar moneda/locale en el mismo render en que llegan los settings,
  // para que formatCurrency no pinte un frame en ARS por defecto.
  if (data?.settings?.currency) {
    applyFormatSettings(data.settings)
  }

  useEffect(() => {
    if (data && !selectedMonth) {
      setSelectedMonth(data.monthOptions[0]?.value ?? getDefaultMonthOptions()[0]?.value ?? '')
    }
  }, [data, selectedMonth])

  useEffect(() => {
    if (data?.settings) {
      applyTheme(data.settings)
    }
  }, [
    data?.settings,
    data?.settings?.primaryColor,
    data?.settings?.darkMode,
    data?.settings?.currency,
    data?.settings?.locale,
  ])

  const rollbackOnError = useCallback(
    (previous: PlanState | undefined, error?: unknown) => {
      if (error instanceof ApiError) {
        if (
          error.isNetwork ||
          (error.status !== undefined && error.status >= 500) ||
          error.status === 409
        ) {
          return
        }
      }
      if (previous) {
        queryClient.setQueryData(planKeys.state(), previous)
      }
    },
    [queryClient],
  )

  const saveSettings = useCallback(
    async (next: UserSettings) => {
      const previous = ensurePlanState(queryClient)
      let userId = previous.userId.trim()

      if (!userId) {
        try {
          userId = await planApi.resolveUserId()
          patchPlanState(queryClient, (state) => ({ ...state, userId }))
        } catch (err) {
          setIsSettingsSaved(false)
          throw err
        }
      }

      patchPlanState(queryClient, (state) => ({ ...state, settings: next, userId }))
      applyTheme(next)
      setIsSettingsSaved(true)

      try {
        const settings = await planApi.updateSettings(userId, next)
        patchPlanState(queryClient, (state) => ({ ...state, settings, userId }))
      } catch (err) {
        rollbackOnError(previous, err)
        setIsSettingsSaved(false)
        throw err
      }

      setTimeout(() => setIsSettingsSaved(false), 2500)
    },
    [queryClient, rollbackOnError],
  )

  const getIncomeEntriesForMonth = useCallback(
    (month: string) => (data?.incomes ?? []).filter((entry) => getMonthFromDate(entry.date) === month),
    [data?.incomes],
  )

  const getIncomeMonthlyTotal = useCallback(
    (month: string) =>
      getIncomeEntriesForMonth(month).reduce((sum, entry) => sum + entry.amount, 0),
    [getIncomeEntriesForMonth],
  )

  const addIncome = useCallback(
    async (entry: Omit<IncomeEntry, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: [...state.incomes, { ...entry, id: tempId }],
      }))

      try {
        const created = await planApi.createIncome(entry)
        patchPlanState(queryClient, (state) => ({
          ...state,
          incomes: state.incomes.map((item) => (item.id === tempId ? created : item)),
        }))
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const updateIncome = useCallback(
    async (entry: IncomeEntry) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: state.incomes.map((item) => (item.id === entry.id ? entry : item)),
      }))

      try {
        await planApi.updateIncome(entry)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const removeIncome = useCallback(
    async (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: state.incomes.filter((item) => item.id !== id),
      }))

      try {
        await planApi.deleteIncome(id)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const addFixedObligation = useCallback(
    async (entry: Omit<FixedObligation, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: [...state.fixedObligations, { ...entry, id: tempId }],
      }))

      try {
        const created = await planApi.createFixedObligation(entry)
        patchPlanState(queryClient, (state) => ({
          ...state,
          fixedObligations: state.fixedObligations.map((item) =>
            item.id === tempId ? created : item,
          ),
        }))
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const updateFixedObligation = useCallback(
    async (entry: FixedObligation) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: state.fixedObligations.map((item) =>
          item.id === entry.id ? entry : item,
        ),
      }))

      try {
        await planApi.updateFixedObligation(entry)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const removeFixedObligation = useCallback(
    async (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: state.fixedObligations.filter((item) => item.id !== id),
      }))

      try {
        await planApi.deleteFixedObligation(id)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const addGoal = useCallback(
    async (goal: Omit<SavingsGoal, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: [...state.goals, { ...goal, id: tempId }],
      }))

      try {
        const created = await planApi.createGoal(goal)
        patchPlanState(queryClient, (state) => ({
          ...state,
          goals: state.goals.map((item) => (item.id === tempId ? created : item)),
        }))
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const updateGoal = useCallback(
    async (goal: SavingsGoal) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: state.goals.map((item) => (item.id === goal.id ? goal : item)),
      }))

      try {
        await planApi.updateGoal(goal)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const removeGoal = useCallback(
    async (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: state.goals.filter((item) => item.id !== id),
      }))

      try {
        await planApi.deleteGoal(id)
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const addInvestment = useCallback(
    async (entry: Omit<InvestmentEntry, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      const optimistic = { ...entry, id: tempId }
      patchPlanState(queryClient, (state) =>
        syncGoalsForInvestmentChange(
          { ...state, investments: [...state.investments, optimistic] },
          undefined,
          optimistic,
        ),
      )

      try {
        const created = await planApi.createInvestment(entry)
        patchPlanState(queryClient, (state) => {
          const withoutTemp = state.investments.filter((item) => item.id !== tempId)
          const revertedGoals = syncGoalsForInvestmentChange(
            { ...state, investments: withoutTemp },
            optimistic,
            undefined,
          )
          return syncGoalsForInvestmentChange(
            { ...revertedGoals, investments: [...withoutTemp, created] },
            undefined,
            created,
          )
        })
        if (created.goalId) {
          const goal = previous.goals.find((item) => item.id === created.goalId)
          if (goal) {
            void planApi.updateGoal({
              ...goal,
              savedAmount: Math.max(
                0,
                Math.min(goal.targetAmount, goal.savedAmount + created.amount),
              ),
            })
          }
        }
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const updateInvestment = useCallback(
    async (entry: InvestmentEntry) => {
      const previous = ensurePlanState(queryClient)
      const existing = previous.investments.find((item) => item.id === entry.id)
      patchPlanState(queryClient, (state) =>
        syncGoalsForInvestmentChange(
          {
            ...state,
            investments: state.investments.map((item) => (item.id === entry.id ? entry : item)),
          },
          existing,
          entry,
        ),
      )

      try {
        await planApi.updateInvestment(entry)
        if (existing?.goalId && existing.goalId !== entry.goalId) {
          const oldGoal = previous.goals.find((item) => item.id === existing.goalId)
          if (oldGoal) {
            void planApi.updateGoal({
              ...oldGoal,
              savedAmount: Math.max(0, oldGoal.savedAmount - existing.amount),
            })
          }
        }
        if (entry.goalId) {
          const goal = previous.goals.find((item) => item.id === entry.goalId)
          if (goal) {
            const delta =
              entry.goalId === existing?.goalId
                ? entry.amount - (existing?.amount ?? 0)
                : entry.amount
            void planApi.updateGoal({
              ...goal,
              savedAmount: Math.max(
                0,
                Math.min(goal.targetAmount, goal.savedAmount + delta),
              ),
            })
          }
        }
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  const removeInvestment = useCallback(
    async (id: string) => {
      const previous = ensurePlanState(queryClient)
      const existing = previous.investments.find((item) => item.id === id)
      patchPlanState(queryClient, (state) =>
        syncGoalsForInvestmentChange(
          { ...state, investments: state.investments.filter((item) => item.id !== id) },
          existing,
          undefined,
        ),
      )

      try {
        await planApi.deleteInvestment(id)
        if (existing?.goalId) {
          const goal = previous.goals.find((item) => item.id === existing.goalId)
          if (goal) {
            void planApi.updateGoal({
              ...goal,
              savedAmount: Math.max(0, goal.savedAmount - existing.amount),
            })
          }
        }
      } catch (err) {
        rollbackOnError(previous, err)
        throw err
      }
    },
    [queryClient, rollbackOnError],
  )

  return useMemo(
    () => ({
      isLoading: isPending,
      isFetching,
      isError,
      error: error as Error | null,
      refetch,
      settings: data?.settings ?? {
        name: '',
        currency: 'ARS' as const,
        locale: 'es-AR',
        monthlySavingsGoal: 0,
        monthlyInvestmentGoal: 0,
        primaryColor: 'zinc' as const,
        darkMode: false,
      },
      isSettingsSaved,
      selectedMonth,
      monthOptions: data?.monthOptions ?? getDefaultMonthOptions(),
      incomes: data?.incomes ?? [],
      fixedObligations: data?.fixedObligations ?? [],
      goals: data?.goals ?? [],
      investments: data?.investments ?? [],
      setSelectedMonth,
      saveSettings,
      getIncomeEntriesForMonth,
      getIncomeMonthlyTotal,
      addIncome,
      updateIncome,
      removeIncome,
      addFixedObligation,
      updateFixedObligation,
      removeFixedObligation,
      addGoal,
      updateGoal,
      removeGoal,
      addInvestment,
      updateInvestment,
      removeInvestment,
    }),
    [
      isPending,
      isFetching,
      isError,
      error,
      refetch,
      data,
      isSettingsSaved,
      selectedMonth,
      saveSettings,
      getIncomeEntriesForMonth,
      getIncomeMonthlyTotal,
      addIncome,
      updateIncome,
      removeIncome,
      addFixedObligation,
      updateFixedObligation,
      removeFixedObligation,
      addGoal,
      updateGoal,
      removeGoal,
      addInvestment,
      updateInvestment,
      removeInvestment,
    ],
  )
}

export type PlanProviderValue = ReturnType<typeof usePlanProvider>
