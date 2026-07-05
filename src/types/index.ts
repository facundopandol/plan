export interface Income {
  id: string
  name: string
  amount: number
  category: string
  recurring: boolean
}

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
  dueDate: string
  category: string
  paid: boolean
}

export type ObligationFrequency = 'Mensual' | 'Anual' | 'Única'

export type ObligationCategory = string

export interface ObligationTypeOption {
  id: string
  name: string
}

export interface FixedObligation {
  id: string
  name: string
  category: ObligationCategory
  amount: number
  frequency: ObligationFrequency
  dueDay: number
  active: boolean
}

export interface Investment {
  id: string
  name: string
  amount: number
  type: string
  returnRate?: number
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

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
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

export interface MonthPlanState {
  incomes: Income[]
  obligations: Obligation[]
  investmentGoal: number
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

export interface MonthDetail {
  summary: MonthlySummary
  incomes: Income[]
  obligations: Obligation[]
  investments: Investment[]
  goals: Goal[]
}

export interface AnalysisMetric {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
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
