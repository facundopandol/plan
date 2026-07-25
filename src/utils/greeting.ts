export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim()
  if (!trimmed) return ''
  return trimmed.split(/\s+/)[0] ?? trimmed
}

/** "Buenos días, Juan" o solo "Buenos días" si no hay nombre. */
export function formatPersonalGreeting(fullName: string): string {
  const greeting = getGreeting()
  const firstName = getFirstName(fullName)
  return firstName ? `${greeting}, ${firstName}` : greeting
}

export function getDaysUntil(date: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(date)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDueLabel(date: string): string {
  const days = getDaysUntil(date)
  if (days < 0) return 'Vencido'
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days <= 7) return `En ${days} días`
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(new Date(date))
}
