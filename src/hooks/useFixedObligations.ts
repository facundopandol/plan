import { useMemo, useState } from 'react'
import type { FixedObligation } from '@/types'
import type { ObligationSortField, SortDirection } from '@/schemas/obligacionSchemas'
import { OBLIGATION_TYPES } from '@/schemas/obligacionSchemas'
import { useFixedObligationsData, usePlan } from '@/hooks/usePlan'
import { obligationMatchesSearch } from '@/utils/obligationMappers'

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
    default:
      return 0
  }
}

export function useFixedObligations() {
  const { isLoading } = usePlan()
  const { obligations, addObligation, updateObligation, removeObligation } =
    useFixedObligationsData()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<ObligationSortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const typeNames = useMemo(() => [...OBLIGATION_TYPES], [])

  const filteredObligations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return obligations
      .filter((item) => {
        const matchesSearch = obligationMatchesSearch(item, query)
        const matchesType = typeFilter === 'all' || item.category === typeFilter
        return matchesSearch && matchesType
      })
      .sort((a, b) => compareValues(a, b, sortField, sortDirection))
  }, [obligations, search, typeFilter, sortField, sortDirection])

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
    sortField,
    sortDirection,
    toggleSort,
    addObligation,
    updateObligation,
    removeObligation,
  }
}
