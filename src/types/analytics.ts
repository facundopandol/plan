export interface MonthlyEvolutionPoint {
  month: string
  label: string
  freeMoney: number
  income: number
  obligations: number
  reserved: number
}

export interface DestinationDistribution {
  label: string
  amount: number
  percentage: number
}

export interface GoalProgressPoint {
  id: string
  name: string
  savedAmount: number
  targetAmount: number
  percentage: number
}

export interface CategoryRanking {
  category: string
  amount: number
  percentage: number
}

export interface AnalysisHighlights {
  monthlyAverage: {
    income: number
    obligations: number
    freeMoney: number
    reserved: number
  }
  topIncome: {
    description: string
    amount: number
    type: string
  }
  topObligation: {
    name: string
    amount: number
    category: string
  }
  topDestination?: {
    name: string
    amount: number
  }
}

export interface AnalyticsData {
  evolution: MonthlyEvolutionPoint[]
  topCategories: CategoryRanking[]
  savingsDistribution: DestinationDistribution[]
  goalProgress: GoalProgressPoint[]
  highlights: AnalysisHighlights
}
