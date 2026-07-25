import { ArrowDown, ArrowDownCircle, ArrowUp, ArrowUpDown, Pencil, Plus, SearchX, Trash2 } from 'lucide-react'
import type { FixedObligation } from '@/types'
import type { ObligationSortField, SortDirection } from '@/schemas/obligacionSchemas'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'

interface ObligationsTableProps {
  obligations: FixedObligation[]
  totalCount: number
  sortField: ObligationSortField
  sortDirection: SortDirection
  onSort: (field: ObligationSortField) => void
  onEdit: (obligation: FixedObligation) => void
  onDelete: (obligation: FixedObligation) => void
  onCreate: () => void
  onClearFilters: () => void
}

const columns: { key: ObligationSortField; label: string; className?: string }[] = [
  { key: 'name', label: 'Obligación' },
  { key: 'amount', label: 'Monto', className: 'text-right' },
]

export function ObligationsTable({
  obligations,
  totalCount,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onCreate,
  onClearFilters,
}: ObligationsTableProps) {
  if (obligations.length === 0) {
    if (totalCount === 0) {
      return (
        <EmptyState
          icon={ArrowDownCircle}
          title="Todavía no cargaste obligaciones"
          description="Agregá alquiler, servicios, tarjetas y otros compromisos que se repiten cada mes."
          action={
            <Button className="gap-2" onClick={onCreate}>
              <Plus className="size-4" />
              Nueva obligación
            </Button>
          }
        />
      )
    }

    return (
      <EmptyState
        icon={SearchX}
        title="Ninguna obligación coincide"
        description="Probá otro tipo o limpiá la búsqueda para ver todas."
        action={
          <Button variant="outline" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
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
                  <div>
                    <span className="font-medium">{obligation.name}</span>
                    {obligation.description && (
                      <p className="text-xs text-muted-foreground">{obligation.category}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                  {formatCurrency(obligation.amount)}
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
