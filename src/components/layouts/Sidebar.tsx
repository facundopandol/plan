import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/mes', label: 'Mes', icon: CalendarDays },
  { to: '/ingresos', label: 'Ingresos', icon: Wallet },
  { to: '/obligaciones', label: 'Obligaciones', icon: PiggyBank },
  { to: '/inversiones', label: 'Ahorro e Inversiones', icon: TrendingUp },
  { to: '/objetivos', label: 'Objetivos', icon: Target },
  { to: '/analisis', label: 'Análisis', icon: BarChart3 },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-xs font-bold">P</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">Plan</span>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
