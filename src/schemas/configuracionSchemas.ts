import { z } from 'zod'

export const settingsFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  currency: z.enum(['ARS', 'USD', 'EUR', 'BRL']),
  monthlySavingsGoal: z.number().min(0, 'El monto no puede ser negativo'),
  monthlyInvestmentGoal: z.number().min(0, 'El monto no puede ser negativo'),
  primaryColor: z.enum(['zinc', 'emerald', 'blue', 'violet', 'rose', 'amber']),
  darkMode: z.boolean(),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
