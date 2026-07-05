import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { InvestmentEntry } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import { getDestinationLabel, getDestinationStyle } from '@/utils/investment'
import type { SavingsGoal } from '@/types'

interface InvestmentEntriesListProps {
  entries: InvestmentEntry[]
  goals: SavingsGoal[]
  onNew: () => void
  onEdit: (entry: InvestmentEntry) => void
  onDelete: (entry: InvestmentEntry) => void
}

export function InvestmentEntriesList({
  entries,
  goals,
  onNew,
  onEdit,
  onDelete,
}: InvestmentEntriesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Destinos registrados</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'destino' : 'destinos'} en el mes
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={onNew}>
          <Plus className="size-3.5" />
          Agregar destino
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center">
          <p className="text-sm font-medium">No hay destinos registrados</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Agregá cómo distribuís el capital reservado del mes.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => {
            const label = getDestinationLabel(entry, goals)
            const styles = getDestinationStyle(entry.type)
            return (
              <article
                key={entry.id}
                className="group flex flex-col rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={cn(
                        'inline-block rounded-md px-2 py-0.5 text-xs font-semibold',
                        styles.badge,
                      )}
                    >
                      {entry.type}
                    </span>
                    <p className="mt-1.5 truncate text-sm font-medium">{label}</p>
                    {entry.comment ? (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.comment}</p>
                    ) : null}
                  </div>
                  <p className={cn('shrink-0 text-lg font-semibold tabular-nums', styles.accent)}>
                    {formatCurrency(entry.amount)}
                  </p>
                </div>

                <div className="mt-3 flex justify-end gap-1 border-t border-border/40 pt-3 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => onEdit(entry)}>
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => onDelete(entry)}
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
