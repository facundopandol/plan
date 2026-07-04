import {
  getAnalysisMetrics,
  getMonthDetail,
  getMonthOptions,
  getUserSettings,
} from '@/services/mockData'
import type { AnalysisMetric, MonthDetail, MonthOption, UserSettings } from '@/types'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchMonthDetail(month: string): Promise<MonthDetail> {
  await delay()
  return getMonthDetail(month)
}

export async function fetchMonthOptions(): Promise<MonthOption[]> {
  await delay(100)
  return getMonthOptions()
}

export async function fetchUserSettings(): Promise<UserSettings> {
  await delay(100)
  return getUserSettings()
}

export async function fetchAnalysisMetrics(): Promise<AnalysisMetric[]> {
  await delay()
  return getAnalysisMetrics()
}
