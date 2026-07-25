import type { DestinationType, InvestmentEntry, SavingsGoal } from '@/types'

export interface DestinationStyle {
  badge: string
  iconBg: string
  bar: string
  accent: string
}

const defaultStyle: DestinationStyle = {
  badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  iconBg: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  bar: 'bg-zinc-500',
  accent: 'text-zinc-600 dark:text-zinc-300',
}

export const DESTINATION_STYLES: Partial<Record<DestinationType, DestinationStyle>> = {
  CEDEAR: {
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    bar: 'bg-violet-500',
    accent: 'text-violet-600 dark:text-violet-300',
  },
  ETF: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    bar: 'bg-blue-500',
    accent: 'text-blue-600 dark:text-blue-300',
  },
  FCI: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    accent: 'text-emerald-600 dark:text-emerald-300',
  },
  'Dólar MEP': {
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
    iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
    bar: 'bg-teal-500',
    accent: 'text-teal-600 dark:text-teal-300',
  },
  'Plazo fijo': {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    bar: 'bg-amber-500',
    accent: 'text-amber-600 dark:text-amber-300',
  },
  Criptomonedas: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
    iconBg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
    bar: 'bg-orange-500',
    accent: 'text-orange-600 dark:text-orange-300',
  },
  'Objetivo personal': {
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    bar: 'bg-rose-500',
    accent: 'text-rose-600 dark:text-rose-300',
  },
  Otro: defaultStyle,
}

/** @deprecated Use DESTINATION_STYLES */
export const INVESTMENT_TYPE_STYLES = DESTINATION_STYLES

export function getDestinationLabel(
  entry: Pick<InvestmentEntry, 'type' | 'goalId' | 'personalName'>,
  goals: SavingsGoal[] = [],
): string {
  if (entry.type === 'Objetivo personal') {
    if (entry.goalId) {
      return goals.find((goal) => goal.id === entry.goalId)?.name ?? entry.personalName ?? 'Objetivo personal'
    }
    return entry.personalName?.trim() || 'Objetivo personal'
  }
  return entry.type
}

export function getDestinationStyle(type: DestinationType): DestinationStyle {
  if (type === 'Objetivo personal') {
    return DESTINATION_STYLES['Objetivo personal'] ?? defaultStyle
  }
  return DESTINATION_STYLES[type] ?? defaultStyle
}

export function computeDestinationDistribution(
  entries: InvestmentEntry[],
  goals: SavingsGoal[] = [],
): { label: string; amount: number; percentage: number }[] {
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0)
  if (total === 0) return []

  const grouped = entries.reduce<Record<string, number>>((acc, entry) => {
    const label = getDestinationLabel(entry, goals)
    acc[label] = (acc[label] ?? 0) + entry.amount
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([label, amount]) => ({
      label,
      amount,
      percentage: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
}

/** @deprecated Use computeDestinationDistribution */
export function computeTypeDistribution(entries: InvestmentEntry[]) {
  return computeDestinationDistribution(entries)
}
