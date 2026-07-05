import { createContext, useContext, type ReactNode } from 'react'
import { usePlanProvider, type PlanProviderValue } from '@/context/usePlanProvider'

export type PlanContextValue = PlanProviderValue

const PlanContext = createContext<PlanContextValue | null>(null)

export function PlanProvider({ children }: { children: ReactNode }) {
  const value = usePlanProvider()
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error('usePlan must be used within PlanProvider')
  }
  return context
}
