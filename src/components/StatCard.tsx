import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  accent?: 'default' | 'positive' | 'warning' | 'info'
}

const accentStyles = {
  default: 'text-foreground',
  positive: 'text-emerald-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
}

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  positive: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-blue-50 text-blue-600',
}

export function StatCard({ title, value, icon: Icon, description, accent = 'default' }: StatCardProps) {
  return (
    <Card className="border-border/60 shadow-none transition-shadow hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('flex size-8 items-center justify-center rounded-lg', iconStyles[accent])}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-semibold tracking-tight', accentStyles[accent])}>
          {formatCurrency(value)}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
