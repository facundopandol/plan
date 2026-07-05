import { useMemo } from 'react'
import { usePlan } from '@/context/PlanContext'
import { buildObligationTypeOptions } from '@/utils/obligationMappers'

export function useObligationTypes() {
  const plan = usePlan()
  const { obligationTypes, fixedObligations, monthPlans, addObligationType, removeObligationType } =
    plan

  const monthObligations = useMemo(
    () => Object.values(monthPlans).flatMap((monthPlan) => monthPlan.obligations),
    [monthPlans],
  )

  const options = useMemo(
    () => buildObligationTypeOptions(obligationTypes, fixedObligations, monthObligations),
    [obligationTypes, fixedObligations, monthObligations],
  )

  return {
    options,
    managedTypes: obligationTypes,
    fixedObligations,
    monthObligations,
    addType: addObligationType,
    removeType: removeObligationType,
  }
}
