import { format, parse, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import type { MonthOption } from '@/types'

export function formatMonthLabel(yearMonth: string): string {
  const date = parse(`${yearMonth}-01`, 'yyyy-MM-dd', new Date())
  const label = format(date, 'MMMM yyyy', { locale: es })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getDefaultMonthOptions(count = 4): MonthOption[] {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = subMonths(now, index)
    const value = format(date, 'yyyy-MM')
    return { value, label: formatMonthLabel(value) }
  })
}

export function getMonthLabelFromOptions(monthOptions: MonthOption[], yearMonth: string): string {
  return monthOptions.find((option) => option.value === yearMonth)?.label ?? formatMonthLabel(yearMonth)
}
