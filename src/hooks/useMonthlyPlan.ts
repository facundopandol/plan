import { useQuery } from '@tanstack/react-query'
import { useMonthContext } from '@/context/MonthContext'
import { fetchMonthDetail } from '@/services/planService'

export function useMonthlyPlan() {
  const { selectedMonth } = useMonthContext()

  return useQuery({
    queryKey: ['monthDetail', selectedMonth],
    queryFn: () => fetchMonthDetail(selectedMonth),
  })
}
