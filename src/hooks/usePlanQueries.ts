import { useQuery } from '@tanstack/react-query'
import { fetchAnalysisMetrics, fetchMonthOptions, fetchUserSettings } from '@/services/planService'

export function useMonthOptions() {
  return useQuery({
    queryKey: ['monthOptions'],
    queryFn: fetchMonthOptions,
    staleTime: Infinity,
  })
}

export function useUserSettings() {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
    staleTime: Infinity,
  })
}

export function useAnalysisMetrics() {
  return useQuery({
    queryKey: ['analysisMetrics'],
    queryFn: fetchAnalysisMetrics,
  })
}
