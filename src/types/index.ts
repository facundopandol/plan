export interface Income {
  id: string
  name: string
  amount: number
  category: string
  recurring: boolean
}

export interface Obligation {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  paid: boolean
}

export interface Investment {
  id: string
  name: string
  amount: number
  type: string
  returnRate?: number
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
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

export interface UserSettings {
  name: string
  currency: string
  locale: string
  investmentTargetPercent: number
  notificationsEnabled: boolean
}
