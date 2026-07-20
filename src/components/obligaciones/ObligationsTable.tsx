import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import type { FixedObligation } from '@/types'
import type { ObligationSortField, SortDirection } from '@/schemas/obligacionSchemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface ObligationsTableProps {
  obligations: FixedObligation[]
  sortField: ObligationSortField
  sortDirection: SortDirection
  onSort: (field: ObligationSortField) => void
  onEdit: (obligation: FixedObligation) => void
  onDelete: (obligation: FixedObligation) => void
}

const columns: { key: ObligationSortField; label: string; className?: string }[] = [
  { key: 'name', label: 'Tipo' },
  { key: 'amount', label: 'Monto', className: 'text-right' },
  { key: 'frequency', label: 'Frecuencia' },
  { key: 'dueDay', label: 'Vencimiento', className: 'text-center' },
  { key: 'active', label: 'Activa', className: 'text-center' },
]

const frequencyVariant: Record<FixedObligation['frequency'], 'secondary' | 'outline' | 'default'> = {
  Mensual: 'secondary',
  Anual: 'outline',
  Única: 'default',
}

export function ObligationsTable({
  obligations,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: ObligationsTableProps) {
  if (obligations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
        <p className="text-sm font-medium">No se encontraron obligaciones</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Probá ajustar los filtros o creá una nueva obligación.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2 sm:hidden">
        {obligations.map((obligation) => (
          <li
            key={obligation.id}
            className="rounded-2xl border border-border/50 bg-card px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{obligation.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge variant={frequencyVariant[obligation.frequency]}>
                    {obligation.frequency}
                  </Badge>
                  <Badge variant={obligation.active ? 'success' : 'outline'}>
                    {obligation.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Día {obligation.dueDay}
                  </span>
                </div>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">
                {formatCurrency(obligation.amount)}
              </p>
            </div>
            <div className="mt-3 flex justify-end gap-1 border-t border-border/40 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => onEdit(obligation)}
              >
                <Pencil className="size-3.5" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-destructive hover:text-destructive"
                onClick={() => onDelete(obligation)}
              >
                <Trash2 className="size-3.5" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl border border-border/50 sm:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {columns.map((col) => (
                  <th key={col.key} className={cn('px-4 py-3', col.className)}>
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                        col.className?.includes('text-right') && 'ml-auto',
                        col.className?.includes('text-center') && 'mx-auto',
                      )}
                    >
                      {col.label}
                      <SortIcon
                        field={col.key}
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {obligations.map((obligation) => (
                <tr
                  key={obligation.id}
                  className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium">{obligation.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                    {formatCurrency(obligation.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={frequencyVariant[obligation.frequency]}>
                      {obligation.frequency}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-center tabular-nums text-muted-foreground">
                    Día {obligation.dueDay}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant={obligation.active ? 'success' : 'outline'}>
                      {obligation.active ? 'Sí' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => onEdit(obligation)}
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(obligation)}
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
    </div>
  )
}

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: ObligationSortField
  sortField: ObligationSortField
  sortDirection: SortDirection
}) {
  if (sortField !== field) {
    return <ArrowUpDown className="size-3 opacity-40" />
  }
  return sortDirection === 'asc' ? (
    <ArrowUp className="size-3" />
  ) : (
    <ArrowDown className="size-3" />
  )
}
