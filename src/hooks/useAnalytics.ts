import { useMemo } from 'react'
import { usePlan } from '@/context/PlanContext'
import { buildAnalyticsFromPlan } from '@/services/analyticsService'
import type { PlanState } from '@/services/planApi'

function toPlanState(plan: ReturnType<typeof usePlan>): PlanState {
  return {
    userId: '',
    settings: plan.settings,
    monthOptions: plan.monthOptions,
    monthIdMap: {},
    incomes: plan.incomes,
    fixedObligations: plan.fixedObligations,
    goals: plan.goals,
    investments: plan.investments,
    monthPlans: plan.monthPlans,
    obligationTypes: plan.obligationTypes,
  }
}

export function useAnalytics() {
  const plan = usePlan()

  const data = useMemo(() => {
    if (plan.isLoading) return undefined
    return buildAnalyticsFromPlan(toPlanState(plan))
  }, [
    plan.isLoading,
    plan.monthOptions,
    plan.incomes,
    plan.investments,
    plan.monthPlans,
    plan.fixedObligations,
    plan.goals,
    plan.settings,
  ])

  return {
    data,
    isLoading: plan.isLoading,
    isError: plan.isError,
    error: plan.error,
    refetch: plan.refetch,
    isFetching: plan.isFetching,
  }
}

export function usePlanStatus() {
  const { isLoading, isError, error, refetch, isFetching } = usePlan()
  return { isLoading, isError, error, refetch, isFetching }
}
