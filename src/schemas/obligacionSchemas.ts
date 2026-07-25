import { z } from 'zod'

export const OBLIGATION_TYPES = [
  'Alquiler',
  'Expensas',
  'Servicios',
  'Tarjetas',
  'Transporte',
  'Otro',
] as const

export type ObligationType = (typeof OBLIGATION_TYPES)[number]

export const fixedObligationFormSchema = z.object({
  type: z.enum(OBLIGATION_TYPES, { message: 'Seleccioná un tipo' }),
  description: z.string().max(120, 'Máximo 120 caracteres'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
})

export type FixedObligationFormValues = z.infer<typeof fixedObligationFormSchema>

export type ObligationSortField = 'name' | 'amount'

export type SortDirection = 'asc' | 'desc'
