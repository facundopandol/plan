import { describe, expect, it } from 'vitest'
import {
  applyFormatSettings,
  formatCurrency,
  localeForCurrency,
} from '@/utils/format'

describe('formatCurrency', () => {
  it('usa ARS por defecto', () => {
    applyFormatSettings({ currency: 'ARS', locale: 'es-AR' })
    const formatted = formatCurrency(1500)
    expect(formatted).toContain('1')
    expect(formatted).toMatch(/1\.?500|1,500/)
  })

  it('cambia el símbolo al aplicar USD', () => {
    applyFormatSettings({ currency: 'USD', locale: 'en-US' })
    const formatted = formatCurrency(1500)
    expect(formatted).toMatch(/\$|USD/)
  })

  it('mapea locale por moneda', () => {
    expect(localeForCurrency('ARS')).toBe('es-AR')
    expect(localeForCurrency('USD')).toBe('en-US')
    expect(localeForCurrency('EUR')).toBe('es-ES')
    expect(localeForCurrency('BRL')).toBe('pt-BR')
  })
})
