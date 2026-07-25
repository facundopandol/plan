import type { DestinationType, InvestmentEntry } from '@/types'

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

export const DESTINATION_STYLES: Record<DestinationType, DestinationStyle> = {
  Ahorro: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    accent: 'text-emerald-600 dark:text-emerald-300',
  },
  Inversión: {
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    bar: 'bg-violet-500',
    accent: 'text-violet-600 dark:text-violet-300',
  },
}

/** @deprecated Use DESTINATION_STYLES */
export const INVESTMENT_TYPE_STYLES = DESTINATION_STYLES

const KNOWN_TYPES = new Set<string>(['Ahorro', 'Inversión'])

export function normalizeDestinationType(value: string): DestinationType {
  return KNOWN_TYPES.has(value) ? (value as DestinationType) : 'Inversión'
}

export function getDestinationLabel(entry: Pick<InvestmentEntry, 'type'>): string {
  return entry.type
}

export function getDestinationStyle(type: string): DestinationStyle {
  return DESTINATION_STYLES[normalizeDestinationType(type)] ?? defaultStyle
}

export function computeDestinationDistribution(
  entries: InvestmentEntry[],
): { label: string; amount: number; percentage: number }[] {
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0)
  if (total === 0) return []

  const grouped = entries.reduce<Record<string, number>>((acc, entry) => {
    const label = getDestinationLabel(entry)
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
