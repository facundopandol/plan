import type { CurrencyCode } from '@/types'

const DEFAULT_LOCALE = 'es-AR'
const DEFAULT_CURRENCY: CurrencyCode = 'ARS'

const LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  ARS: 'es-AR',
  USD: 'en-US',
  EUR: 'es-ES',
  BRL: 'pt-BR',
}

let activeLocale = DEFAULT_LOCALE
let activeCurrency: CurrencyCode = DEFAULT_CURRENCY

let currencyFormatter = createCurrencyFormatter(activeLocale, activeCurrency)
let percentFormatter = createPercentFormatter(activeLocale)

function createCurrencyFormatter(locale: string, currency: CurrencyCode) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function createPercentFormatter(locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })
}

export function localeForCurrency(currency: CurrencyCode): string {
  return LOCALE_BY_CURRENCY[currency] ?? DEFAULT_LOCALE
}

/** Aplica moneda y locale para todos los montos de la app (igual que applyTheme). */
export function applyFormatSettings(settings: {
  currency: CurrencyCode
  locale?: string
}): void {
  activeCurrency = settings.currency
  activeLocale = settings.locale?.trim() || localeForCurrency(settings.currency)
  currencyFormatter = createCurrencyFormatter(activeLocale, activeCurrency)
  percentFormatter = createPercentFormatter(activeLocale)
}

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value / 100)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat(activeLocale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
