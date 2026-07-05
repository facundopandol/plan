import { useMemo, useState } from 'react'
import type { FixedObligation, ObligationFrequency } from '@/types'
import type { ObligationSortField, SortDirection } from '@/schemas/obligacionSchemas'
import { useFixedObligationsData, usePlan } from '@/hooks/usePlan'
import { useObligationTypes } from '@/hooks/useObligationTypes'

function compareValues(
  a: FixedObligation,
  b: FixedObligation,
  field: ObligationSortField,
  direction: SortDirection,
): number {
  const factor = direction === 'asc' ? 1 : -1

  switch (field) {
    case 'name':
      return a.name.localeCompare(b.name, 'es') * factor
    case 'amount':
      return (a.amount - b.amount) * factor
    case 'frequency':
      return a.frequency.localeCompare(b.frequency, 'es') * factor
    case 'dueDay':
      return (a.dueDay - b.dueDay) * factor
    case 'active':
      return (Number(a.active) - Number(b.active)) * factor
    default:
      return 0
  }
}

export function useFixedObligations() {
  const { isLoading } = usePlan()
  const { options } = useObligationTypes()
  const { obligations, addObligation, updateObligation, removeObligation } =
    useFixedObligationsData()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [frequencyFilter, setFrequencyFilter] = useState<ObligationFrequency | 'all'>('all')
  const [sortField, setSortField] = useState<ObligationSortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const typeNames = useMemo(() => options.map((item) => item.name), [options])

  const filteredObligations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return obligations
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        const matchesType = typeFilter === 'all' || item.name === typeFilter
        const matchesFrequency = frequencyFilter === 'all' || item.frequency === frequencyFilter
        return matchesSearch && matchesType && matchesFrequency
      })
      .sort((a, b) => compareValues(a, b, sortField, sortDirection))
  }, [obligations, search, typeFilter, frequencyFilter, sortField, sortDirection])

  const toggleSort = (field: ObligationSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return {
    isLoading,
    obligations: filteredObligations,
    typeNames,
    totalCount: obligations.length,
    filteredCount: filteredObligations.length,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    frequencyFilter,
    setFrequencyFilter,
    sortField,
    sortDirection,
    toggleSort,
    addObligation,
    updateObligation,
    removeObligation,
  }
}
