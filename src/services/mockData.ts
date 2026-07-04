import type {
  AnalysisMetric,
  MonthDetail,
  MonthOption,
  UserSettings,
} from '@/types'

export const MOCK_USER: UserSettings = {
  name: 'María González',
  currency: 'ARS',
  locale: 'es-AR',
  investmentTargetPercent: 20,
  notificationsEnabled: true,
}

export const MOCK_MONTHS: MonthOption[] = [
  { value: '2026-07', label: 'Julio 2026' },
  { value: '2026-06', label: 'Junio 2026' },
  { value: '2026-05', label: 'Mayo 2026' },
  { value: '2026-04', label: 'Abril 2026' },
]

const monthData: Record<string, MonthDetail> = {
  '2026-07': {
    summary: {
      income: 1_850_000,
      obligations: 980_000,
      available: 870_000,
      investmentGoal: 370_000,
      freeMoney: 500_000,
    },
    incomes: [
      { id: '1', name: 'Salario', amount: 1_500_000, category: 'Trabajo', recurring: true },
      { id: '2', name: 'Freelance', amount: 250_000, category: 'Extra', recurring: false },
      { id: '3', name: 'Alquiler recibido', amount: 100_000, category: 'Inversión', recurring: true },
    ],
    obligations: [
      { id: '1', name: 'Alquiler', amount: 420_000, dueDate: '2026-07-05', category: 'Vivienda', paid: true },
      { id: '2', name: 'Servicios', amount: 85_000, dueDate: '2026-07-10', category: 'Hogar', paid: true },
      { id: '3', name: 'Tarjeta de crédito', amount: 180_000, dueDate: '2026-07-15', category: 'Deuda', paid: false },
      { id: '4', name: 'Seguro médico', amount: 95_000, dueDate: '2026-07-20', category: 'Salud', paid: false },
      { id: '5', name: 'Internet + celular', amount: 45_000, dueDate: '2026-07-25', category: 'Hogar', paid: false },
      { id: '6', name: 'Gimnasio', amount: 35_000, dueDate: '2026-07-01', category: 'Salud', paid: true },
      { id: '7', name: 'Colegio', amount: 120_000, dueDate: '2026-07-08', category: 'Educación', paid: true },
    ],
    investments: [
      { id: '1', name: 'Cedears', amount: 180_000, type: 'Acciones', returnRate: 12.5 },
      { id: '2', name: 'FCI Money Market', amount: 120_000, type: 'Fondo', returnRate: 45.2 },
      { id: '3', name: 'Plazo fijo UVA', amount: 70_000, type: 'Plazo fijo', returnRate: 8.0 },
    ],
    goals: [
      { id: '1', name: 'Fondo de emergencia', targetAmount: 3_000_000, currentAmount: 1_800_000, deadline: '2026-12-31' },
      { id: '2', name: 'Viaje a Europa', targetAmount: 2_500_000, currentAmount: 950_000, deadline: '2027-06-01' },
      { id: '3', name: 'Entrada departamento', targetAmount: 15_000_000, currentAmount: 4_200_000, deadline: '2028-03-01' },
    ],
  },
  '2026-06': {
    summary: {
      income: 1_720_000,
      obligations: 910_000,
      available: 810_000,
      investmentGoal: 344_000,
      freeMoney: 466_000,
    },
    incomes: [
      { id: '1', name: 'Salario', amount: 1_500_000, category: 'Trabajo', recurring: true },
      { id: '2', name: 'Freelance', amount: 120_000, category: 'Extra', recurring: false },
      { id: '3', name: 'Alquiler recibido', amount: 100_000, category: 'Inversión', recurring: true },
    ],
    obligations: [
      { id: '1', name: 'Alquiler', amount: 420_000, dueDate: '2026-06-05', category: 'Vivienda', paid: true },
      { id: '2', name: 'Servicios', amount: 78_000, dueDate: '2026-06-10', category: 'Hogar', paid: true },
      { id: '3', name: 'Tarjeta de crédito', amount: 165_000, dueDate: '2026-06-15', category: 'Deuda', paid: true },
      { id: '4', name: 'Seguro médico', amount: 95_000, dueDate: '2026-06-20', category: 'Salud', paid: true },
      { id: '5', name: 'Internet + celular', amount: 42_000, dueDate: '2026-06-25', category: 'Hogar', paid: true },
      { id: '6', name: 'Gimnasio', amount: 35_000, dueDate: '2026-06-01', category: 'Salud', paid: true },
      { id: '7', name: 'Colegio', amount: 75_000, dueDate: '2026-06-08', category: 'Educación', paid: true },
    ],
    investments: [
      { id: '1', name: 'Cedears', amount: 150_000, type: 'Acciones', returnRate: 10.2 },
      { id: '2', name: 'FCI Money Market', amount: 110_000, type: 'Fondo', returnRate: 42.8 },
      { id: '3', name: 'Plazo fijo UVA', amount: 84_000, type: 'Plazo fijo', returnRate: 7.5 },
    ],
    goals: [
      { id: '1', name: 'Fondo de emergencia', targetAmount: 3_000_000, currentAmount: 1_650_000, deadline: '2026-12-31' },
      { id: '2', name: 'Viaje a Europa', targetAmount: 2_500_000, currentAmount: 820_000, deadline: '2027-06-01' },
      { id: '3', name: 'Entrada departamento', targetAmount: 15_000_000, currentAmount: 4_000_000, deadline: '2028-03-01' },
    ],
  },
  '2026-05': {
    summary: {
      income: 1_680_000,
      obligations: 895_000,
      available: 785_000,
      investmentGoal: 336_000,
      freeMoney: 449_000,
    },
    incomes: [
      { id: '1', name: 'Salario', amount: 1_500_000, category: 'Trabajo', recurring: true },
      { id: '2', name: 'Bonus trimestral', amount: 80_000, category: 'Extra', recurring: false },
      { id: '3', name: 'Alquiler recibido', amount: 100_000, category: 'Inversión', recurring: true },
    ],
    obligations: [
      { id: '1', name: 'Alquiler', amount: 420_000, dueDate: '2026-05-05', category: 'Vivienda', paid: true },
      { id: '2', name: 'Servicios', amount: 72_000, dueDate: '2026-05-10', category: 'Hogar', paid: true },
      { id: '3', name: 'Tarjeta de crédito', amount: 158_000, dueDate: '2026-05-15', category: 'Deuda', paid: true },
      { id: '4', name: 'Seguro médico', amount: 95_000, dueDate: '2026-05-20', category: 'Salud', paid: true },
      { id: '5', name: 'Internet + celular', amount: 40_000, dueDate: '2026-05-25', category: 'Hogar', paid: true },
    ],
    investments: [
      { id: '1', name: 'Cedears', amount: 140_000, type: 'Acciones', returnRate: 8.5 },
      { id: '2', name: 'FCI Money Market', amount: 100_000, type: 'Fondo', returnRate: 40.1 },
    ],
    goals: [
      { id: '1', name: 'Fondo de emergencia', targetAmount: 3_000_000, currentAmount: 1_500_000, deadline: '2026-12-31' },
      { id: '2', name: 'Viaje a Europa', targetAmount: 2_500_000, currentAmount: 700_000, deadline: '2027-06-01' },
    ],
  },
  '2026-04': {
    summary: {
      income: 1_600_000,
      obligations: 870_000,
      available: 730_000,
      investmentGoal: 320_000,
      freeMoney: 410_000,
    },
    incomes: [
      { id: '1', name: 'Salario', amount: 1_500_000, category: 'Trabajo', recurring: true },
      { id: '2', name: 'Alquiler recibido', amount: 100_000, category: 'Inversión', recurring: true },
    ],
    obligations: [
      { id: '1', name: 'Alquiler', amount: 420_000, dueDate: '2026-04-05', category: 'Vivienda', paid: true },
      { id: '2', name: 'Servicios', amount: 70_000, dueDate: '2026-04-10', category: 'Hogar', paid: true },
      { id: '3', name: 'Tarjeta de crédito', amount: 150_000, dueDate: '2026-04-15', category: 'Deuda', paid: true },
      { id: '4', name: 'Seguro médico', amount: 95_000, dueDate: '2026-04-20', category: 'Salud', paid: true },
      { id: '5', name: 'Internet + celular', amount: 40_000, dueDate: '2026-04-25', category: 'Hogar', paid: true },
      { id: '6', name: 'Gimnasio', amount: 35_000, dueDate: '2026-04-01', category: 'Salud', paid: true },
      { id: '7', name: 'Colegio', amount: 60_000, dueDate: '2026-04-08', category: 'Educación', paid: true },
    ],
    investments: [
      { id: '1', name: 'Cedears', amount: 120_000, type: 'Acciones', returnRate: 6.2 },
      { id: '2', name: 'FCI Money Market', amount: 90_000, type: 'Fondo', returnRate: 38.5 },
    ],
    goals: [
      { id: '1', name: 'Fondo de emergencia', targetAmount: 3_000_000, currentAmount: 1_350_000, deadline: '2026-12-31' },
      { id: '2', name: 'Viaje a Europa', targetAmount: 2_500_000, currentAmount: 580_000, deadline: '2027-06-01' },
    ],
  },
}

export const MOCK_ANALYSIS: AnalysisMetric[] = [
  { label: 'Tasa de ahorro', value: '27%', change: '+3% vs mes anterior', trend: 'up' },
  { label: 'Gastos fijos', value: '53%', change: 'Estable', trend: 'neutral' },
  { label: 'Inversión del disponible', value: '43%', change: '+5% vs mes anterior', trend: 'up' },
  { label: 'Dinero libre / ingreso', value: '27%', change: '-1% vs mes anterior', trend: 'down' },
  { label: 'Obligaciones pagadas', value: '43%', change: '3 de 7 pendientes', trend: 'neutral' },
  { label: 'Progreso objetivos', value: '58%', change: '+4% vs mes anterior', trend: 'up' },
]

export function getMonthDetail(month: string): MonthDetail {
  return monthData[month] ?? monthData['2026-07']
}

export function getMonthOptions(): MonthOption[] {
  return MOCK_MONTHS
}

export function getUserSettings(): UserSettings {
  return MOCK_USER
}

export function getAnalysisMetrics(): AnalysisMetric[] {
  return MOCK_ANALYSIS
}
