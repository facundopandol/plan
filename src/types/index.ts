export type IncomeType = 'Sueldo' | 'Horas extras' | 'Aguinaldo' | 'Bono' | 'Otro'

export interface IncomeEntry {
  id: string
  date: string
  type: IncomeType
  description: string
  amount: number
}

export interface Obligation {
  id: string
  name: string
  amount: number
  category: string
  description?: string
}

export type ObligationCategory = string

export interface ObligationTypeOption {
  id: string
  name: string
}

export interface FixedObligation {
  id: string
  name: string
  category: ObligationCategory
  description?: string
  amount: number
}

export type DestinationType =
  | 'CEDEAR'
  | 'ETF'
  | 'FCI'
  | 'Dólar MEP'
  | 'Plazo fijo'
  | 'Criptomonedas'
  | 'Objetivo personal'
  | 'Otro'

/** @deprecated Use DestinationType */
export type InvestmentType = DestinationType

export interface InvestmentEntry {
  id: string
  date: string
  type: DestinationType
  amount: number
  comment?: string
  goalId?: string
  personalName?: string
}

export type GoalColor = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'teal'

export type GoalIcon =
  | 'Target'
  | 'Plane'
  | 'Home'
  | 'Car'
  | 'GraduationCap'
  | 'Heart'
  | 'PiggyBank'
  | 'Shield'
  | 'Luggage'
  | 'Building'

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  targetDate: string
  icon: GoalIcon
  color: GoalColor
}

export interface GoalColorStyle {
  iconBg: string
  iconText: string
  bar: string
  accent: string
  ring: string
}

export interface MonthlySummary {
  income: number
  obligations: number
  available: number
  investmentGoal: number
  freeMoney: number
}

export interface MonthOption {
  value: string
  label: string
}

export type PrimaryColor = 'zinc' | 'emerald' | 'blue' | 'violet' | 'rose' | 'amber'

export type CurrencyCode = 'ARS' | 'USD' | 'EUR' | 'BRL'

export interface UserSettings {
  name: string
  currency: CurrencyCode
  locale: string
  monthlySavingsGoal: number
  monthlyInvestmentGoal: number
  primaryColor: PrimaryColor
  darkMode: boolean
}
