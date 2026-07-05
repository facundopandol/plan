import { z } from 'zod'

export const incomeFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  category: z.string().min(1, 'Seleccioná una categoría'),
  recurring: z.boolean(),
})

export const obligationFormSchema = z.object({
  type: z.string().min(1, 'Seleccioná un tipo'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  dueDate: z.string().min(1, 'La fecha es obligatoria'),
  paid: z.boolean(),
})

export const investmentGoalFormSchema = z.object({
  amount: z.number().min(0, 'El monto no puede ser negativo'),
})

export type IncomeFormValues = z.infer<typeof incomeFormSchema>
export type ObligationFormValues = z.infer<typeof obligationFormSchema>
export type InvestmentGoalFormValues = z.infer<typeof investmentGoalFormSchema>

export const INCOME_CATEGORIES = ['Trabajo', 'Extra', 'Inversión', 'Otro'] as const
