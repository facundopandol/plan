import { NavLink, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  LayoutDashboard,
  MoreHorizontal,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const primaryItems: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}[] = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/mes', label: 'Mes', icon: CalendarDays },
  { to: '/ingresos', label: 'Ingresos', icon: Wallet },
  { to: '/obligaciones', label: 'Oblig.', icon: PiggyBank },
]

const morePaths = ['/inversiones', '/objetivos', '/analisis', '/configuracion']

export function MobileBottomNav({
  onOpenMore,
}: {
  onOpenMore: () => void
}) {
  const { pathname } = useLocation()
  const moreActive = morePaths.some((path) => pathname.startsWith(path))

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5 px-1">
        {primaryItems.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="min-w-0">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground active:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('size-5', isActive && 'stroke-[2.25]')}
                    aria-hidden
                  />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li className="min-w-0">
          <button
            type="button"
            onClick={onOpenMore}
            aria-current={moreActive ? 'page' : undefined}
            className={cn(
              'flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition-colors',
              moreActive
                ? 'text-foreground'
                : 'text-muted-foreground active:text-foreground',
            )}
          >
            <MoreHorizontal
              className={cn('size-5', moreActive && 'stroke-[2.25]')}
              aria-hidden
            />
            <span>Más</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
