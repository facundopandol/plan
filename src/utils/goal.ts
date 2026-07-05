import type { GoalColor, GoalColorStyle, GoalIcon } from '@/types'

export const GOAL_COLOR_STYLES: Record<GoalColor, GoalColorStyle> = {
  emerald: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    bar: 'bg-emerald-500',
    accent: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    bar: 'bg-blue-500',
    accent: 'text-blue-600',
    ring: 'ring-blue-200',
  },
  violet: {
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-700',
    bar: 'bg-violet-500',
    accent: 'text-violet-600',
    ring: 'ring-violet-200',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    bar: 'bg-amber-500',
    accent: 'text-amber-600',
    ring: 'ring-amber-200',
  },
  rose: {
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-700',
    bar: 'bg-rose-500',
    accent: 'text-rose-600',
    ring: 'ring-rose-200',
  },
  teal: {
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-700',
    bar: 'bg-teal-500',
    accent: 'text-teal-600',
    ring: 'ring-teal-200',
  },
}

export const GOAL_COLORS: GoalColor[] = ['emerald', 'blue', 'violet', 'amber', 'rose', 'teal']

export const GOAL_ICONS: GoalIcon[] = [
  'Target',
  'Plane',
  'Home',
  'Car',
  'GraduationCap',
  'Heart',
  'PiggyBank',
  'Shield',
  'Luggage',
  'Building',
]

export function getGoalProgress(saved: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(Math.round((saved / target) * 100), 100)
}

export function getGoalRemaining(saved: number, target: number): number {
  return Math.max(target - saved, 0)
}

export function getDaysRemaining(targetDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDaysRemaining(days: number): string {
  if (days < 0) return 'Vencido'
  if (days === 0) return 'Hoy'
  if (days === 1) return '1 día'
  if (days < 30) return `${days} días`
  if (days < 365) {
    const months = Math.round(days / 30)
    return `${months} mes${months !== 1 ? 'es' : ''}`
  }
  const years = Math.round(days / 365)
  return `${years} año${years !== 1 ? 's' : ''}`
}
