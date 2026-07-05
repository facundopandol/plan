import type { PrimaryColor } from '@/types'

interface ThemeColors {
  primary: string
  primaryForeground: string
  ring: string
}

export const PRIMARY_COLOR_MAP: Record<PrimaryColor, ThemeColors> = {
  zinc: {
    primary: 'oklch(0.205 0 0)',
    primaryForeground: 'oklch(0.985 0 0)',
    ring: 'oklch(0.708 0 0)',
  },
  emerald: {
    primary: 'oklch(0.55 0.15 160)',
    primaryForeground: 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.12 160)',
  },
  blue: {
    primary: 'oklch(0.55 0.18 250)',
    primaryForeground: 'oklch(0.985 0 0)',
    ring: 'oklch(0.65 0.14 250)',
  },
  violet: {
    primary: 'oklch(0.52 0.2 290)',
    primaryForeground: 'oklch(0.985 0 0)',
    ring: 'oklch(0.62 0.16 290)',
  },
  rose: {
    primary: 'oklch(0.58 0.2 15)',
    primaryForeground: 'oklch(0.985 0 0)',
    ring: 'oklch(0.68 0.16 15)',
  },
  amber: {
    primary: 'oklch(0.65 0.16 75)',
    primaryForeground: 'oklch(0.2 0 0)',
    ring: 'oklch(0.75 0.12 75)',
  },
}

export const PRIMARY_COLOR_SWATCHES: Record<PrimaryColor, string> = {
  zinc: '#27272a',
  emerald: '#10b981',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  amber: '#f59e0b',
}

export function applyTheme(settings: {
  primaryColor: PrimaryColor
  darkMode: boolean
}): void {
  const root = document.documentElement
  const colors = PRIMARY_COLOR_MAP[settings.primaryColor]

  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--primary-foreground', colors.primaryForeground)
  root.style.setProperty('--ring', colors.ring)
  root.classList.toggle('dark', settings.darkMode)
}

export const CURRENCY_OPTIONS = [
  { value: 'ARS' as const, label: 'Peso argentino (ARS)' },
  { value: 'USD' as const, label: 'Dólar estadounidense (USD)' },
  { value: 'EUR' as const, label: 'Euro (EUR)' },
  { value: 'BRL' as const, label: 'Real brasileño (BRL)' },
]

export const PRIMARY_COLOR_OPTIONS: { value: PrimaryColor; label: string }[] = [
  { value: 'zinc', label: 'Neutro' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'blue', label: 'Azul' },
  { value: 'violet', label: 'Violeta' },
  { value: 'rose', label: 'Rosa' },
  { value: 'amber', label: 'Ámbar' },
]
