import { z } from 'zod'

export const GOAL_ICON_OPTIONS = [
  'Target',
  'Plane',
  'Home',
  'Car',
  'GraduationCap',
  'Heart',
  'PiggyBank',
  'Shield',
  'Luggage',
  'Building',
] as const

export const GOAL_COLOR_OPTIONS = ['emerald', 'blue', 'violet', 'amber', 'rose', 'teal'] as const

export const savingsGoalFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  targetAmount: z.number().positive('El monto objetivo debe ser mayor a 0'),
  savedAmount: z.number().min(0, 'El monto ahorrado no puede ser negativo'),
  targetDate: z.string().min(1, 'La fecha objetivo es obligatoria'),
  icon: z.enum(GOAL_ICON_OPTIONS, { message: 'Seleccioná un ícono' }),
  color: z.enum(GOAL_COLOR_OPTIONS, { message: 'Seleccioná un color' }),
})

export type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>
