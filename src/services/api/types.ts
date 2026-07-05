export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface ApiUser {
  id: string
  email: string
  name: string
  currency: string
  locale: string
  monthly_savings_goal: string | number
  monthly_investment_goal: string | number
  primary_color: string
  dark_mode: boolean
  is_active: boolean
}

export interface ApiMonth {
  id: string
  user_id: string
  year_month: string
  label: string
  investment_goal: string | number
}

export interface ApiIncome {
  id: string
  user_id: string
  month_id: string | null
  category_id: string | null
  date: string | null
  name: string
  description: string | null
  income_type: string
  amount: string | number
  recurring: boolean
  is_plan_item: boolean
}

export interface ApiObligation {
  id: string
  user_id: string
  month_id: string | null
  category_id: string | null
  name: string
  amount: string | number
  due_date: string | null
  due_day: number | null
  frequency: string | null
  category_name: string | null
  active: boolean
  paid: boolean
  is_fixed: boolean
}

export interface ApiInvestment {
  id: string
  user_id: string
  goal_id: string | null
  date: string
  investment_type: string
  amount: string | number
  comment: string
  personal_destination_name: string | null
}

export interface ApiGoal {
  id: string
  user_id: string
  name: string
  target_amount: string | number
  saved_amount: string | number
  target_date: string
  icon: string
  color: string
}

export interface ApiCategory {
  id: string
  user_id: string
  name: string
  kind: 'income' | 'obligation' | 'investment'
  description: string | null
}
