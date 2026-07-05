import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import type { IncomeEntry } from '@/types'
import type { IncomeSortDirection } from '@/schemas/ingresoSchemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/utils/format'
import { getIncomeEntryLabel } from '@/utils/incomeMappers'

interface IncomesTableProps {
  entries: IncomeEntry[]
  sortDirection: IncomeSortDirection
  onToggleSort: () => void
  onEdit: (entry: IncomeEntry) => void
  onDelete: (entry: IncomeEntry) => void
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
  sortDirection,
  onToggleSort,
  onEdit,
  onDelete,
}: IncomesTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
        <p className="text-sm font-medium">No hay ingresos registrados</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Agregá un ingreso o ajustá el buscador.
        </p>
      </div>
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
                <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-emerald-600">
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
