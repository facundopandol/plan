import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate } from '@/utils/format'

interface DataTableProps {
  headers: string[]
  rows: Array<Array<string | number | boolean>>
  formatters?: Record<number, (value: string | number | boolean) => ReactNode>
}

export function DataTable({ headers, rows, formatters }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                'border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20',
              )}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {formatters?.[cellIndex]
                    ? formatters[cellIndex](cell)
                    : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CurrencyCell({ value }: { value: number }) {
  return <span className="font-medium tabular-nums">{formatCurrency(value)}</span>
}

export function DateCell({ value }: { value: string }) {
  return <span className="text-muted-foreground">{formatDate(value)}</span>
}

export function PaidBadge({ paid }: { paid: boolean }) {
  return (
    <Badge variant={paid ? 'success' : 'warning'}>
      {paid ? 'Pagado' : 'Pendiente'}
    </Badge>
  )
}

export function RecurringBadge({ recurring }: { recurring: boolean }) {
  return (
    <Badge variant={recurring ? 'secondary' : 'outline'}>
      {recurring ? 'Recurrente' : 'Único'}
    </Badge>
  )
}
