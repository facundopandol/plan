import { formatCurrency } from '@/utils/format'

export function formatChartAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return String(value)
}

export function formatChartTooltip(value: number): string {
  return formatCurrency(value)
}

export const CHART_COLORS = {
  freeMoney: '#14b8a6',
  income: '#10b981',
  obligations: '#f59e0b',
  reserved: '#8b5cf6',
  grid: '#e4e4e7',
  muted: '#71717a',
} as const
