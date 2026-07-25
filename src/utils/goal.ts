import type { GoalColor, GoalColorStyle, GoalIcon } from '@/types'

export const GOAL_COLOR_STYLES: Record<GoalColor, GoalColorStyle> = {
  emerald: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    iconText: 'text-emerald-700 dark:text-emerald-300',
    bar: 'bg-emerald-500',
    accent: 'text-emerald-600 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-800/60',
  },
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/60',
    iconText: 'text-blue-700 dark:text-blue-300',
    bar: 'bg-blue-500',
    accent: 'text-blue-600 dark:text-blue-300',
    ring: 'ring-blue-200 dark:ring-blue-800/60',
  },
  violet: {
    iconBg: 'bg-violet-100 dark:bg-violet-900/60',
    iconText: 'text-violet-700 dark:text-violet-300',
    bar: 'bg-violet-500',
    accent: 'text-violet-600 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-800/60',
  },
  amber: {
    iconBg: 'bg-amber-100 dark:bg-amber-900/60',
    iconText: 'text-amber-700 dark:text-amber-300',
    bar: 'bg-amber-500',
    accent: 'text-amber-600 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-800/60',
  },
  rose: {
    iconBg: 'bg-rose-100 dark:bg-rose-900/60',
    iconText: 'text-rose-700 dark:text-rose-300',
    bar: 'bg-rose-500',
    accent: 'text-rose-600 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-800/60',
  },
  teal: {
    iconBg: 'bg-teal-100 dark:bg-teal-900/60',
    iconText: 'text-teal-700 dark:text-teal-300',
    bar: 'bg-teal-500',
    accent: 'text-teal-600 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-800/60',
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
