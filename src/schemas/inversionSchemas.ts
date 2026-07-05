import { z } from 'zod'

export const DESTINATION_TYPES = [
  'CEDEAR',
  'ETF',
  'FCI',
  'Dólar MEP',
  'Plazo fijo',
  'Criptomonedas',
  'Objetivo personal',
  'Otro',
] as const

/** @deprecated Use DESTINATION_TYPES */
export const INVESTMENT_TYPES = DESTINATION_TYPES

export const investmentEntryFormSchema = z
  .object({
    date: z.string().min(1, 'La fecha es obligatoria'),
    type: z.enum(DESTINATION_TYPES, { message: 'Seleccioná un tipo' }),
    amount: z.number().positive('El monto debe ser mayor a 0'),
    comment: z.string().optional(),
    goalId: z.string().optional(),
    personalName: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === 'Objetivo personal' && !values.goalId && !values.personalName?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Elegí un objetivo existente o escribí un nombre',
        path: ['personalName'],
      })
    }
  })

export type InvestmentEntryFormValues = z.infer<typeof investmentEntryFormSchema>

export type InvestmentSortDirection = 'asc' | 'desc'

export interface DestinationDistribution {
  label: string
  amount: number
  percentage: number
}

/** @deprecated Use DestinationDistribution */
export type TypeDistribution = DestinationDistribution
