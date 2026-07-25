import type { IncomeEntry, IncomeType } from '@/types'

export function getIncomeEntryLabel(entry: Pick<IncomeEntry, 'type' | 'description'>): string {
  if (entry.type === 'Otro' && entry.description.trim()) {
    return entry.description
  }
  return entry.type
}

export function resolveIncomeDescription(type: IncomeType, description: string): string {
  if (type === 'Otro') return description.trim()
  return type
}
