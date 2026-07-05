import type { FixedObligation, Obligation, ObligationTypeOption } from '@/types'

export function resolveObligationName(type: string): string {
  return type.trim()
}

export function parseObligationToForm(name: string): { type: string } {
  return { type: name }
}

export function getActiveMonthlyFixedObligations(
  obligations: FixedObligation[],
): FixedObligation[] {
  return obligations.filter((item) => item.active && item.frequency === 'Mensual')
}

export function fixedObligationToMonthView(
  obligation: FixedObligation,
  month: string,
): Obligation {
  const day = String(obligation.dueDay).padStart(2, '0')
  return {
    id: obligation.id,
    name: obligation.name,
    amount: obligation.amount,
    dueDate: `${month}-${day}`,
    category: obligation.category,
    paid: false,
  }
}

export function sumActiveMonthlyFixedObligations(obligations: FixedObligation[]): number {
  return getActiveMonthlyFixedObligations(obligations).reduce((sum, item) => sum + item.amount, 0)
}

export function buildObligationTypeOptions(
  categories: ObligationTypeOption[],
  fixedObligations: FixedObligation[],
  monthObligations: Obligation[],
): ObligationTypeOption[] {
  const byName = new Map(categories.map((item) => [item.name, item]))

  for (const obligation of fixedObligations) {
    if (!byName.has(obligation.name)) {
      byName.set(obligation.name, { id: `legacy-${obligation.name}`, name: obligation.name })
    }
  }

  for (const obligation of monthObligations) {
    if (!byName.has(obligation.name)) {
      byName.set(obligation.name, { id: `legacy-${obligation.name}`, name: obligation.name })
    }
  }

  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export function isManagedObligationType(id: string): boolean {
  return !id.startsWith('legacy-')
}

export function isObligationTypeInUse(
  typeName: string,
  fixedObligations: FixedObligation[],
  monthObligations: Obligation[],
): boolean {
  return (
    fixedObligations.some((item) => item.name === typeName) ||
    monthObligations.some((item) => item.name === typeName)
  )
}
