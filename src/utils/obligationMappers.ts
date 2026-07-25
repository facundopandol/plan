import type { FixedObligation, Obligation } from '@/types'
import { OBLIGATION_TYPES, type ObligationType } from '@/schemas/obligacionSchemas'

export function formatObligationLabel(type: string, description?: string): string {
  const base = type.trim()
  const detail = description?.trim()
  if (!base) return detail ?? ''
  return detail ? `${base} · ${detail}` : base
}

export function buildObligationPayload(type: string, description?: string) {
  const category = type.trim()
  const detail = description?.trim() || undefined
  return {
    category,
    description: detail,
    name: formatObligationLabel(category, detail),
  }
}

export function parseObligationToForm(obligation: {
  category: string
  description?: string
}): { type: ObligationType; description: string } {
  const category = obligation.category.trim()
  const isKnownType = (OBLIGATION_TYPES as readonly string[]).includes(category)
  return {
    type: (isKnownType ? category : 'Otro') as ObligationType,
    description: isKnownType
      ? (obligation.description?.trim() ?? '')
      : category !== 'Otro'
        ? category
        : (obligation.description?.trim() ?? ''),
  }
}

export function getObligationTypeNames(currentType?: string): string[] {
  const names = new Set<string>(OBLIGATION_TYPES)
  if (currentType?.trim() && !names.has(currentType.trim())) {
    names.add(currentType.trim())
  }
  return Array.from(names)
}

export function fixedObligationToMonthView(
  obligation: FixedObligation,
): Obligation {
  return {
    id: obligation.id,
    name: obligation.name,
    amount: obligation.amount,
    category: obligation.category,
    description: obligation.description,
  }
}

export function sumFixedObligations(obligations: FixedObligation[]): number {
  return obligations.reduce((sum, item) => sum + item.amount, 0)
}

export function obligationMatchesSearch(
  obligation: FixedObligation | Obligation,
  query: string,
): boolean {
  if (!query) return true
  const haystack = [
    obligation.name,
    obligation.category,
    obligation.description ?? '',
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}
