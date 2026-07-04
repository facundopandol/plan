import { createContext, useContext, useState, type ReactNode } from 'react'
import { MOCK_MONTHS } from '@/services/mockData'

interface MonthContextValue {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
}

const MonthContext = createContext<MonthContextValue | null>(null)

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(MOCK_MONTHS[0].value)

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  )
}

export function useMonthContext() {
  const context = useContext(MonthContext)
  if (!context) {
    throw new Error('useMonthContext must be used within MonthProvider')
  }
  return context
}
