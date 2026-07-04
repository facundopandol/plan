const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('es-AR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
