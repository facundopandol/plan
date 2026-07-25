import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Plus, SearchX, Trash2, Wallet } from 'lucide-react'
import type { IncomeEntry } from '@/types'
import type { IncomeSortDirection } from '@/schemas/ingresoSchemas'
import { EmptyState } from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/utils/format'
import { getIncomeEntryLabel } from '@/utils/incomeMappers'

interface IncomesTableProps {
  entries: IncomeEntry[]
  totalCount: number
  sortDirection: IncomeSortDirection
  onToggleSort: () => void
  onEdit: (entry: IncomeEntry) => void
  onDelete: (entry: IncomeEntry) => void
  onCreate: () => void
  onClearSearch: () => void
}

const typeVariant: Record<
  IncomeEntry['type'],
  'default' | 'secondary' | 'outline' | 'success'
> = {
  Sueldo: 'default',
  'Horas extras': 'secondary',
  Aguinaldo: 'success',
  Bono: 'outline',
  Otro: 'outline',
}

export function IncomesTable({
  entries,
  totalCount,
  sortDirection,
  onToggleSort,
  onEdit,
  onDelete,
  onCreate,
  onClearSearch,
}: IncomesTableProps) {
  if (entries.length === 0) {
    if (totalCount === 0) {
      return (
        <EmptyState
          icon={Wallet}
          title="Todavía no hay ingresos este mes"
          description="Cargá tu sueldo u otros ingresos para ver el dinero disponible en el Dashboard."
          action={
            <Button className="gap-2" onClick={onCreate}>
              <Plus className="size-4" />
              Nuevo ingreso
            </Button>
          }
        />
      )
    }

    return (
      <EmptyState
        icon={SearchX}
        title="Ningún ingreso coincide"
        description="Probá otra búsqueda o limpiala para ver todos los ingresos del mes."
        action={
          <Button variant="outline" onClick={onClearSearch}>
            Limpiar búsqueda
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left">
                <button
                  type="button"
                  onClick={onToggleSort}
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Fecha
                  {sortDirection === 'asc' ? (
                    <ArrowUp className="size-3" />
                  ) : sortDirection === 'desc' ? (
                    <ArrowDown className="size-3" />
                  ) : (
                    <ArrowUpDown className="size-3 opacity-40" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Descripción
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monto
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20"
              >
                <td className="px-4 py-3.5 text-muted-foreground">{formatDate(entry.date)}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={typeVariant[entry.type]} className="font-normal">
                    {entry.type}
                  </Badge>
                </td>
                <td className={cn('px-4 py-3.5 font-medium text-muted-foreground')}>
                  {entry.type === 'Otro' ? getIncomeEntryLabel(entry) : '—'}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-300">
                  {formatCurrency(entry.amount)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(entry)}
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(entry)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
