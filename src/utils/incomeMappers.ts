import type { Income, IncomeEntry, IncomeType } from '@/types'

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

const TYPE_TO_MES_CATEGORY: Record<IncomeType, string> = {
  Sueldo: 'Trabajo',
  'Horas extras': 'Extra',
  Aguinaldo: 'Extra',
  Bono: 'Extra',
  Otro: 'Otro',
}

const MES_CATEGORY_TO_TYPE: Record<string, IncomeType> = {
  Trabajo: 'Sueldo',
  Extra: 'Horas extras',
  Inversión: 'Otro',
  Otro: 'Otro',
}

export function incomeEntryToPlanIncome(entry: IncomeEntry): Income {
  return {
    id: entry.id,
    name: getIncomeEntryLabel(entry),
    amount: entry.amount,
    category: TYPE_TO_MES_CATEGORY[entry.type] ?? entry.type,
    recurring: false,
  }
}

export function planIncomeToNewEntry(income: Omit<Income, 'id'>, month: string): Omit<IncomeEntry, 'id'> {
  return {
    date: `${month}-01`,
    type: MES_CATEGORY_TO_TYPE[income.category] ?? 'Otro',
    description: income.name,
    amount: income.amount,
  }
}

export function planIncomeToUpdatedEntry(income: Income, existing: IncomeEntry): IncomeEntry {
  return {
    ...existing,
    description: income.name,
    amount: income.amount,
    type: MES_CATEGORY_TO_TYPE[income.category] ?? existing.type,
  }
}
