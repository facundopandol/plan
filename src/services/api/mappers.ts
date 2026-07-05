import type {
  CurrencyCode,
  FixedObligation,
  GoalColor,
  GoalIcon,
  Income,
  IncomeEntry,
  IncomeType,
  InvestmentEntry,
  InvestmentType,
  MonthOption,
  MonthPlanState,
  Obligation,
  ObligationCategory,
  ObligationTypeOption,
  ObligationFrequency,
  PrimaryColor,
  SavingsGoal,
  UserSettings,
} from '@/types'
import type {
  ApiGoal,
  ApiIncome,
  ApiInvestment,
  ApiMonth,
  ApiObligation,
  ApiUser,
  ApiCategory,
} from '@/services/api/types'

export const toNumber = (value: string | number): number => Number(value)

export function mapUserToSettings(user: ApiUser): UserSettings {
  return {
    name: user.name,
    currency: user.currency as CurrencyCode,
    locale: user.locale,
    monthlySavingsGoal: toNumber(user.monthly_savings_goal),
    monthlyInvestmentGoal: toNumber(user.monthly_investment_goal),
    primaryColor: user.primary_color as PrimaryColor,
    darkMode: user.dark_mode,
  }
}

export function mapSettingsToUserUpdate(settings: UserSettings) {
  return {
    name: settings.name,
    currency: settings.currency,
    locale: settings.locale,
    monthly_savings_goal: settings.monthlySavingsGoal,
    monthly_investment_goal: settings.monthlyInvestmentGoal,
    primary_color: settings.primaryColor,
    dark_mode: settings.darkMode,
  }
}

export function mapMonthToOption(month: ApiMonth): MonthOption {
  return { value: month.year_month, label: month.label }
}

export function mapIncomeToEntry(income: ApiIncome): IncomeEntry {
  return {
    id: income.id,
    date: income.date ?? '',
    type: income.income_type as IncomeType,
    description: income.description ?? income.name,
    amount: toNumber(income.amount),
  }
}

export function mapIncomeToPlanItem(income: ApiIncome): Income {
  return {
    id: income.id,
    name: income.name,
    amount: toNumber(income.amount),
    category: income.description ?? 'General',
    recurring: income.recurring,
  }
}

export function mapObligationToFixed(obligation: ApiObligation): FixedObligation {
  return {
    id: obligation.id,
    name: obligation.name,
    category: (obligation.category_name ?? 'Otros') as ObligationCategory,
    amount: toNumber(obligation.amount),
    frequency: (obligation.frequency ?? 'Mensual') as ObligationFrequency,
    dueDay: obligation.due_day ?? 1,
    active: obligation.active,
  }
}

export function mapObligationToMonth(obligation: ApiObligation): Obligation {
  return {
    id: obligation.id,
    name: obligation.name,
    amount: toNumber(obligation.amount),
    dueDate: obligation.due_date ?? '',
    category: obligation.category_name ?? 'Otros',
    paid: obligation.paid,
  }
}

export function mapInvestment(investment: ApiInvestment): InvestmentEntry {
  return {
    id: investment.id,
    date: investment.date,
    type: investment.investment_type as InvestmentType,
    amount: toNumber(investment.amount),
    comment: investment.comment || undefined,
    goalId: investment.goal_id ?? undefined,
    personalName: investment.personal_destination_name ?? undefined,
  }
}

export function mapGoal(goal: ApiGoal): SavingsGoal {
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: toNumber(goal.target_amount),
    savedAmount: toNumber(goal.saved_amount),
    targetDate: goal.target_date,
    icon: goal.icon as GoalIcon,
    color: goal.color as GoalColor,
  }
}

export function incomeEntryToApi(entry: Omit<IncomeEntry, 'id'>) {
  return {
    name: entry.description || entry.type,
    description: entry.description,
    income_type: entry.type,
    amount: entry.amount,
    date: entry.date,
    is_plan_item: false,
    recurring: false,
  }
}

export function planIncomeToApi(income: Omit<Income, 'id'>, monthId: string) {
  return {
    name: income.name,
    description: income.category,
    income_type: 'Otro',
    amount: income.amount,
    month_id: monthId,
    is_plan_item: true,
    recurring: income.recurring,
  }
}

export function fixedObligationToApi(entry: Omit<FixedObligation, 'id'>) {
  return {
    name: entry.name,
    amount: entry.amount,
    category_name: entry.category,
    frequency: entry.frequency,
    due_day: entry.dueDay,
    active: entry.active,
    is_fixed: true,
    paid: false,
  }
}

export function monthObligationToApi(obligation: Omit<Obligation, 'id'>, monthId: string) {
  return {
    name: obligation.name,
    amount: obligation.amount,
    due_date: obligation.dueDate,
    category_name: obligation.category,
    paid: obligation.paid,
    is_fixed: false,
    month_id: monthId,
    active: true,
  }
}

export function investmentEntryToApi(entry: Omit<InvestmentEntry, 'id'>) {
  return {
    date: entry.date,
    investment_type: entry.type,
    amount: entry.amount,
    comment: entry.comment ?? '',
    goal_id: entry.goalId ?? null,
    personal_destination_name: entry.personalName ?? null,
  }
}

export function savingsGoalToApi(goal: Omit<SavingsGoal, 'id'>) {
  return {
    name: goal.name,
    target_amount: goal.targetAmount,
    saved_amount: goal.savedAmount,
    target_date: goal.targetDate,
    icon: goal.icon,
    color: goal.color,
  }
}

export function mapObligationType(category: ApiCategory): ObligationTypeOption {
  return {
    id: category.id,
    name: category.name,
  }
}

export function buildMonthPlans(
  months: ApiMonth[],
  incomes: ApiIncome[],
  obligations: ApiObligation[],
): Record<string, MonthPlanState> {
  const monthPlans: Record<string, MonthPlanState> = {}

  for (const month of months) {
    monthPlans[month.year_month] = {
      incomes: incomes
        .filter((item) => item.is_plan_item && item.month_id === month.id)
        .map(mapIncomeToPlanItem),
      obligations: obligations
        .filter((item) => !item.is_fixed && item.month_id === month.id)
        .map(mapObligationToMonth),
      investmentGoal: toNumber(month.investment_goal),
    }
  }

  return monthPlans
}
