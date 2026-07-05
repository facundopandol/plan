import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/context/PlanContext'

export function QueryErrorBanner() {
  const { isError, error, refetch, isFetching } = usePlan()

  if (!isError) return null

  return (
    <div
      role="alert"
      className="mb-6 flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-destructive">
        {error?.message ?? 'No se pudieron cargar los datos.'} Podés seguir usando la app; los
        cambios se guardarán cuando el servidor esté disponible.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => void refetch()}
        disabled={isFetching}
        className="shrink-0"
      >
        <RefreshCw className={`mr-2 size-4 ${isFetching ? 'animate-spin' : ''}`} />
        Reintentar
      </Button>
    </div>
  )
}
