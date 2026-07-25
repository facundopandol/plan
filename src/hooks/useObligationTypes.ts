import { useMemo } from 'react'
import { OBLIGATION_TYPES } from '@/schemas/obligacionSchemas'
import type { ObligationTypeOption } from '@/types'

export function useObligationTypes(currentType?: string) {
  const options = useMemo<ObligationTypeOption[]>(() => {
    const names = new Set<string>(OBLIGATION_TYPES)
    if (currentType?.trim() && !names.has(currentType.trim())) {
      names.add(currentType.trim())
    }
    return Array.from(names).map((name) => ({ id: name, name }))
  }, [currentType])

  return { options }
}
