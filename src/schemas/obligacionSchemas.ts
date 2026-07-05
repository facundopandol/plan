import { z } from 'zod'

export const DEFAULT_OBLIGATION_TYPES = [
  'Alquiler',
  'Expensas',
  'Servicios',
  'Salud',
  'Transporte',
  'Educación',
  'Suscripciones',
  'Deuda',
] as const

export const OBLIGATION_FREQUENCIES = ['Mensual', 'Anual', 'Única'] as const

export const fixedObligationFormSchema = z.object({
  type: z.string().min(1, 'Seleccioná un tipo'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  frequency: z.enum(OBLIGATION_FREQUENCIES, { message: 'Seleccioná una frecuencia' }),
  dueDay: z
    .number()
    .int('Debe ser un número entero')
    .min(1, 'El día mínimo es 1')
    .max(31, 'El día máximo es 31'),
  active: z.boolean(),
})

export type FixedObligationFormValues = z.infer<typeof fixedObligationFormSchema>

export type ObligationSortField = 'name' | 'amount' | 'frequency' | 'dueDay' | 'active'

export type SortDirection = 'asc' | 'desc'
