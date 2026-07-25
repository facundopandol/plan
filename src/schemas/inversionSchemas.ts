import { z } from 'zod'

export const DESTINATION_TYPES = ['Ahorro', 'Inversión'] as const

/** @deprecated Use DESTINATION_TYPES */
export const INVESTMENT_TYPES = DESTINATION_TYPES

export const investmentEntryFormSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  type: z.enum(DESTINATION_TYPES, { message: 'Seleccioná Ahorro o Inversión' }),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  comment: z.string().optional(),
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
