import { z } from 'zod'

export const INCOME_TYPES = [
  'Sueldo',
  'Horas extras',
  'Aguinaldo',
  'Bono',
  'Otro',
] as const

export const incomeEntryFormSchema = z
  .object({
    date: z.string().min(1, 'La fecha es obligatoria'),
    type: z.enum(INCOME_TYPES, { message: 'Seleccioná un tipo' }),
    description: z.string(),
    amount: z.number().positive('El monto debe ser mayor a 0'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Otro' && !data.description.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Ingresá una descripción para tipo Otro',
        path: ['description'],
      })
    }
  })

export type IncomeEntryFormValues = z.infer<typeof incomeEntryFormSchema>

export type IncomeSortDirection = 'asc' | 'desc'
