import { describe, expect, it } from 'vitest'
import type { FixedObligation } from '@/types'
import { sumFixedObligations } from '@/utils/obligationMappers'

const obligations: FixedObligation[] = [
  {
    id: '1',
    name: 'Alquiler',
    category: 'Alquiler',
    amount: 300_000,
  },
  {
    id: '2',
    name: 'Internet',
    category: 'Servicios',
    amount: 25_000,
  },
]

describe('obligationMappers', () => {
  it('suma todas las obligaciones del mes', () => {
    expect(sumFixedObligations(obligations)).toBe(325_000)
  })
})
