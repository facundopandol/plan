import { CalendarDays, Sparkles } from 'lucide-react'
import { useMonthOptions, useSelectedMonth, useSettings } from '@/hooks/usePlan'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPersonalGreeting } from '@/utils/greeting'

export function DashboardHeader() {
  const { selectedMonth, setSelectedMonth } = useSelectedMonth()
  const months = useMonthOptions()
  const { settings } = useSettings()

  const selectedLabel = months.find((m) => m.value === selectedMonth)?.label
  const hasName = Boolean(settings.name.trim())

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-zinc-50 via-white to-zinc-50/50 p-6 md:p-8 dark:from-zinc-900/80 dark:via-card dark:to-zinc-900/40">
      <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-zinc-100/60 blur-3xl dark:bg-zinc-700/30" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 size-32 rounded-full bg-emerald-50/80 blur-3xl dark:bg-emerald-900/25" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3.5" />
            Tu plan del mes
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {formatPersonalGreeting(settings.name)}
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            {!hasName
              ? 'Poné tu nombre en Configuración para personalizar el saludo.'
              : selectedLabel
                ? `Así está tu planificación para ${selectedLabel.toLowerCase()}.`
                : 'Revisá cuánto tenés disponible, invertir y para vivir.'}
          </p>
        </div>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-10 w-full min-w-[200px] border-border/60 bg-white/80 shadow-sm backdrop-blur-sm sm:w-[220px] dark:bg-muted/60 dark:border-border">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Seleccionar mes" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
