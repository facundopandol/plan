import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMonthContext } from '@/context/MonthContext'
import { useMonthOptions, useUserSettings } from '@/hooks/usePlanQueries'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from '@/components/layouts/Sidebar'
import { getInitials } from '@/utils/format'

export function TopBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const { selectedMonth, setSelectedMonth } = useMonthContext()
  const { data: months = [] } = useMonthOptions()
  const { data: user } = useUserSettings()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {!isDashboard && (
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] border-border/60 bg-background">
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
        <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {user ? getInitials(user.name) : '??'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
