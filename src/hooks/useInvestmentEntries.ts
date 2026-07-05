import { useMemo, useState } from 'react'
import { useGoals, useInvestmentActions, usePlan, useSelectedMonth } from '@/hooks/usePlan'
import type { InvestmentEntry } from '@/types'
import type { InvestmentSortDirection } from '@/schemas/inversionSchemas'
import { getMonthFromDate } from '@/utils/date'
import { computeDestinationDistribution } from '@/utils/investment'

export function useInvestmentEntries() {
  const { selectedMonth } = useSelectedMonth()
  const { isLoading } = usePlan()
  const { goals } = useGoals()
  const { investments, addInvestment, updateInvestment, removeInvestment } =
    useInvestmentActions()

  const [search, setSearch] = useState('')
  const [sortDirection, setSortDirection] = useState<InvestmentSortDirection>('desc')

  const monthEntries = useMemo(
    () => investments.filter((entry) => getMonthFromDate(entry.date) === selectedMonth),
    [investments, selectedMonth],
  )

  const monthlyTotal = useMemo(
    () => monthEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [monthEntries],
  )

  const distribution = useMemo(
    () => computeDestinationDistribution(monthEntries, goals),
    [monthEntries, goals],
  )

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return monthEntries
      .filter((entry) => {
        if (!query) return true
        return (
          (entry.comment ?? '').toLowerCase().includes(query) ||
          entry.type.toLowerCase().includes(query) ||
          (entry.personalName ?? '').toLowerCase().includes(query)
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

  const createEntry = (data: Omit<InvestmentEntry, 'id'>) => addInvestment(data)
  const editEntry = (entry: InvestmentEntry) => updateInvestment(entry)
  const deleteEntry = (id: string) => removeInvestment(id)

  return {
    isLoading,
    goals,
    entries: filteredEntries,
    monthlyTotal,
    distribution,
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
