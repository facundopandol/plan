import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function SettingCard({ title, description, icon: Icon, children, className }: SettingCardProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-border/50 bg-card',
        className,
      )}
    >
      <div className="border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex size-7 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
              <Icon className="size-3.5" strokeWidth={1.75} />
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </section>
  )
}

interface SettingRowProps {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}

export function SettingRow({ label, hint, children, htmlFor }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:max-w-[45%]">
        <label htmlFor={htmlFor} className="text-sm text-foreground">
          {label}
        </label>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="w-full sm:w-auto sm:min-w-[200px] sm:max-w-[280px]">{children}</div>
    </div>
  )
}
