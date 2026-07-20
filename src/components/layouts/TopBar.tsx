import { useLocation } from 'react-router-dom'
import { useMonthOptions, useSelectedMonth, useSettings } from '@/hooks/usePlan'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getInitials } from '@/utils/format'

export function TopBar() {
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const { selectedMonth, setSelectedMonth } = useSelectedMonth()
  const months = useMonthOptions()
  const { settings } = useSettings()

  return (
    <header className="shrink-0 border-b border-border/60 bg-background pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Plan</span>
          </div>

          {!isDashboard && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px] border-border/60 bg-background sm:w-[180px]">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium sm:inline">{settings.name}</span>
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(settings.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
