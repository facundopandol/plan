import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  FixedObligation,
  Income,
  IncomeEntry,
  InvestmentEntry,
  MonthPlanState,
  Obligation,
  SavingsGoal,
  UserSettings,
} from '@/types'
import { planKeys } from '@/lib/api/queryKeys'
import { ApiError } from '@/lib/api/client'
import { createEmptyPlanState, planApi, type PlanState } from '@/services/planApi'
import { generateId } from '@/utils/calculateSummary'
import { getMonthFromDate } from '@/utils/date'
import { formatMonthLabel, getDefaultMonthOptions } from '@/utils/month'
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

const EMPTY_MONTH_PLAN: MonthPlanState = {
  incomes: [],
  obligations: [],
  investmentGoal: 0,
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
    initialData: createEmptyPlanState,
    retry: 2,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (data && !selectedMonth) {
      setSelectedMonth(data.monthOptions[0]?.value ?? getDefaultMonthOptions()[0]?.value ?? '')
    }
  }, [data, selectedMonth])

  useEffect(() => {
    if (data?.settings) {
      applyTheme(data.settings)
    }
  }, [data?.settings?.primaryColor, data?.settings?.darkMode, data?.settings])

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
    (next: UserSettings) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({ ...state, settings: next }))
      applyTheme(next)
      setIsSettingsSaved(true)

      void planApi
        .updateSettings(previous.userId, next)
        .then((settings) => {
          patchPlanState(queryClient, (state) => ({ ...state, settings }))
        })
        .catch((err) => rollbackOnError(previous, err))
        .finally(() => {
          setTimeout(() => setIsSettingsSaved(false), 2500)
        })
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
    (entry: Omit<IncomeEntry, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: [...state.incomes, { ...entry, id: tempId }],
      }))

      void planApi
        .createIncome(entry)
        .then((created) => {
          patchPlanState(queryClient, (state) => ({
            ...state,
            incomes: state.incomes.map((item) => (item.id === tempId ? created : item)),
          }))
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const updateIncome = useCallback(
    (entry: IncomeEntry) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: state.incomes.map((item) => (item.id === entry.id ? entry : item)),
      }))

      void planApi.updateIncome(entry).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const removeIncome = useCallback(
    (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        incomes: state.incomes.filter((item) => item.id !== id),
      }))

      void planApi.deleteIncome(id).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const addFixedObligation = useCallback(
    (entry: Omit<FixedObligation, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: [...state.fixedObligations, { ...entry, id: tempId }],
      }))

      void planApi
        .createFixedObligation(entry)
        .then((created) => {
          patchPlanState(queryClient, (state) => ({
            ...state,
            fixedObligations: state.fixedObligations.map((item) =>
              item.id === tempId ? created : item,
            ),
          }))
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const updateFixedObligation = useCallback(
    (entry: FixedObligation) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: state.fixedObligations.map((item) => (item.id === entry.id ? entry : item)),
      }))

      void planApi.updateFixedObligation(entry).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const removeFixedObligation = useCallback(
    (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        fixedObligations: state.fixedObligations.filter((item) => item.id !== id),
      }))

      void planApi.deleteFixedObligation(id).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const addGoal = useCallback(
    (goal: Omit<SavingsGoal, 'id'>) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: [...state.goals, { ...goal, id: tempId }],
      }))

      void planApi
        .createGoal(goal)
        .then((created) => {
          patchPlanState(queryClient, (state) => ({
            ...state,
            goals: state.goals.map((item) => (item.id === tempId ? created : item)),
          }))
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const updateGoal = useCallback(
    (goal: SavingsGoal) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: state.goals.map((item) => (item.id === goal.id ? goal : item)),
      }))

      void planApi.updateGoal(goal).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const removeGoal = useCallback(
    (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        goals: state.goals.filter((item) => item.id !== id),
      }))

      void planApi.deleteGoal(id).catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const addInvestment = useCallback(
    (entry: Omit<InvestmentEntry, 'id'>) => {
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

      void planApi
        .createInvestment(entry)
        .then((created) => {
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
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const updateInvestment = useCallback(
    (entry: InvestmentEntry) => {
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

      void planApi
        .updateInvestment(entry)
        .then(() => {
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
              const delta = entry.goalId === existing?.goalId ? entry.amount - (existing?.amount ?? 0) : entry.amount
              void planApi.updateGoal({
                ...goal,
                savedAmount: Math.max(
                  0,
                  Math.min(goal.targetAmount, goal.savedAmount + delta),
                ),
              })
            }
          }
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const removeInvestment = useCallback(
    (id: string) => {
      const previous = ensurePlanState(queryClient)
      const existing = previous.investments.find((item) => item.id === id)
      patchPlanState(queryClient, (state) =>
        syncGoalsForInvestmentChange(
          { ...state, investments: state.investments.filter((item) => item.id !== id) },
          existing,
          undefined,
        ),
      )

      void planApi
        .deleteInvestment(id)
        .then(() => {
          if (existing?.goalId) {
            const goal = previous.goals.find((item) => item.id === existing.goalId)
            if (goal) {
              void planApi.updateGoal({
                ...goal,
                savedAmount: Math.max(0, goal.savedAmount - existing.amount),
              })
            }
          }
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const getMonthPlan = useCallback(
    (month: string) => data?.monthPlans[month],
    [data?.monthPlans],
  )

  const resolveMonthId = useCallback(
    async (month: string): Promise<string> => {
      const state = queryClient.getQueryData<PlanState>(planKeys.state()) ?? createEmptyPlanState()
      if (state.monthIdMap[month]) return state.monthIdMap[month]

      const monthId = await planApi.ensureMonth(month, state.monthIdMap)
      patchPlanState(queryClient, (current) => ({
        ...current,
        monthIdMap: { ...current.monthIdMap, [month]: monthId },
        monthOptions: current.monthOptions.some((option) => option.value === month)
          ? current.monthOptions
          : [{ value: month, label: formatMonthLabel(month) }, ...current.monthOptions],
        monthPlans: current.monthPlans[month]
          ? current.monthPlans
          : { ...current.monthPlans, [month]: EMPTY_MONTH_PLAN },
      }))
      return monthId
    },
    [queryClient],
  )

  const updateMonthPlan = useCallback(
    (month: string, updater: (plan: MonthPlanState) => MonthPlanState) => {
      patchPlanState(queryClient, (state) => {
        const current = state.monthPlans[month] ?? EMPTY_MONTH_PLAN
        return {
          ...state,
          monthPlans: { ...state.monthPlans, [month]: updater(current) },
        }
      })
    },
    [queryClient],
  )

  const setMonthInvestmentGoal = useCallback(
    (month: string, amount: number) => {
      const previous = ensurePlanState(queryClient)
      updateMonthPlan(month, (plan) => ({ ...plan, investmentGoal: amount }))

      void (async () => {
        try {
          const monthId = await resolveMonthId(month)
          await planApi.updateMonthInvestmentGoal(
            month,
            monthId,
            amount,
            formatMonthLabel(month),
          )
        } catch (err) {
          rollbackOnError(previous, err)
        }
      })()
    },
    [resolveMonthId, rollbackOnError, updateMonthPlan],
  )

  const addMonthIncome = useCallback(
    (month: string, income: Income) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      updateMonthPlan(month, (plan) => ({ ...plan, incomes: [...plan.incomes, { ...income, id: tempId }] }))

      void (async () => {
        try {
          const monthId = await resolveMonthId(month)
          const created = await planApi.createMonthIncome(monthId, income)
          updateMonthPlan(month, (plan) => ({
            ...plan,
            incomes: plan.incomes.map((item) => (item.id === tempId ? created : item)),
          }))
        } catch (err) {
          rollbackOnError(previous, err)
        }
      })()
    },
    [resolveMonthId, rollbackOnError, updateMonthPlan],
  )

  const updateMonthIncome = useCallback(
    (month: string, income: Income) => {
      const previous = ensurePlanState(queryClient)
      updateMonthPlan(month, (plan) => ({
        ...plan,
        incomes: plan.incomes.map((item) => (item.id === income.id ? income : item)),
      }))

      void (async () => {
        try {
          const monthId = await resolveMonthId(month)
          await planApi.updateMonthIncome(income, monthId)
        } catch (err) {
          rollbackOnError(previous, err)
        }
      })()
    },
    [resolveMonthId, rollbackOnError, updateMonthPlan],
  )

  const removeMonthIncome = useCallback(
    (month: string, id: string) => {
      const previous = ensurePlanState(queryClient)
      updateMonthPlan(month, (plan) => ({
        ...plan,
        incomes: plan.incomes.filter((item) => item.id !== id),
      }))

      void planApi.deleteMonthIncome(id).catch((err) => rollbackOnError(previous, err))
    },
    [rollbackOnError, updateMonthPlan],
  )

  const addMonthObligation = useCallback(
    (month: string, obligation: Obligation) => {
      const previous = ensurePlanState(queryClient)
      const tempId = generateId()
      updateMonthPlan(month, (plan) => ({
        ...plan,
        obligations: [...plan.obligations, { ...obligation, id: tempId }],
      }))

      void (async () => {
        try {
          const monthId = await resolveMonthId(month)
          const created = await planApi.createMonthObligation(monthId, obligation)
          updateMonthPlan(month, (plan) => ({
            ...plan,
            obligations: plan.obligations.map((item) => (item.id === tempId ? created : item)),
          }))
        } catch (err) {
          rollbackOnError(previous, err)
        }
      })()
    },
    [resolveMonthId, rollbackOnError, updateMonthPlan],
  )

  const updateMonthObligation = useCallback(
    (month: string, obligation: Obligation) => {
      const previous = ensurePlanState(queryClient)
      updateMonthPlan(month, (plan) => ({
        ...plan,
        obligations: plan.obligations.map((item) =>
          item.id === obligation.id ? obligation : item,
        ),
      }))

      void (async () => {
        try {
          const monthId = await resolveMonthId(month)
          await planApi.updateMonthObligation(obligation, monthId)
        } catch (err) {
          rollbackOnError(previous, err)
        }
      })()
    },
    [resolveMonthId, rollbackOnError, updateMonthPlan],
  )

  const removeMonthObligation = useCallback(
    (month: string, id: string) => {
      const previous = ensurePlanState(queryClient)
      updateMonthPlan(month, (plan) => ({
        ...plan,
        obligations: plan.obligations.filter((item) => item.id !== id),
      }))

      void planApi.deleteMonthObligation(id).catch((err) => rollbackOnError(previous, err))
    },
    [rollbackOnError, updateMonthPlan],
  )

  const addObligationType = useCallback(
    (name: string) => {
      const previous = ensurePlanState(queryClient)
      const trimmed = name.trim()
      if (!trimmed) return

      if (previous.obligationTypes.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) {
        return
      }

      const tempId = generateId()
      patchPlanState(queryClient, (state) => ({
        ...state,
        obligationTypes: [...state.obligationTypes, { id: tempId, name: trimmed }],
      }))

      void planApi
        .createObligationType(trimmed)
        .then((created) => {
          patchPlanState(queryClient, (state) => ({
            ...state,
            obligationTypes: state.obligationTypes.map((item) =>
              item.id === tempId ? created : item,
            ),
          }))
        })
        .catch((err) => rollbackOnError(previous, err))
    },
    [queryClient, rollbackOnError],
  )

  const removeObligationType = useCallback(
    (id: string) => {
      const previous = ensurePlanState(queryClient)
      patchPlanState(queryClient, (state) => ({
        ...state,
        obligationTypes: state.obligationTypes.filter((item) => item.id !== id),
      }))

      void planApi.deleteObligationType(id).catch((err) => rollbackOnError(previous, err))
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
      monthPlans: data?.monthPlans ?? {},
      obligationTypes: data?.obligationTypes ?? [],
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
      getMonthPlan,
      setMonthInvestmentGoal,
      addMonthIncome,
      updateMonthIncome,
      removeMonthIncome,
      addMonthObligation,
      updateMonthObligation,
      removeMonthObligation,
      addObligationType,
      removeObligationType,
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
      getMonthPlan,
      setMonthInvestmentGoal,
      addMonthIncome,
      updateMonthIncome,
      removeMonthIncome,
      addMonthObligation,
      updateMonthObligation,
      removeMonthObligation,
      addObligationType,
      removeObligationType,
    ],
  )
}

export type PlanProviderValue = ReturnType<typeof usePlanProvider>
