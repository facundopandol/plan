import { useMemo, useState } from 'react'
import { usePlan, useIncomeActions, useSelectedMonth } from '@/hooks/usePlan'
import type { IncomeEntry } from '@/types'
import type { IncomeSortDirection } from '@/schemas/ingresoSchemas'

export function useIncomeEntries() {
  const { selectedMonth } = useSelectedMonth()
  const { isLoading } = usePlan()
  const { getEntriesForMonth, getMonthlyTotal, addIncome, updateIncome, removeIncome } =
    useIncomeActions()

  const [search, setSearch] = useState('')
  const [sortDirection, setSortDirection] = useState<IncomeSortDirection>('desc')

  const monthEntries = getEntriesForMonth(selectedMonth)
  const monthlyTotal = getMonthlyTotal(selectedMonth)

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return monthEntries
      .filter((entry) => {
        if (!query) return true
        return (
          entry.description.toLowerCase().includes(query) ||
          entry.type.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
        return sortDirection === 'asc' ? diff : -diff
      })
  }, [monthEntries, search, sortDirection])

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const createEntry = (data: Omit<IncomeEntry, 'id'>) => addIncome(data)
  const editEntry = (entry: IncomeEntry) => updateIncome(entry)
  const deleteEntry = (id: string) => removeIncome(id)

  return {
    isLoading,
    entries: filteredEntries,
    monthlyTotal,
    totalCount: monthEntries.length,
    filteredCount: filteredEntries.length,
    search,
    setSearch,
    sortDirection,
    toggleSort,
    createEntry,
    editEntry,
    deleteEntry,
  }
}
