import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Income } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IncomeFormModal } from '@/components/mes/IncomeFormModal'
import { formatCurrency } from '@/utils/format'

interface IncomeSectionProps {
  incomes: Income[]
  onAdd: (income: Income) => void
  onUpdate: (income: Income) => void
  onRemove: (id: string) => void
}

export function IncomeSection({ incomes, onAdd, onUpdate, onRemove }: IncomeSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Income | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (income: Income) => {
    setEditing(income)
    setModalOpen(true)
  }

  const handleSubmit = (income: Income) => {
    if (editing) {
      onUpdate(income)
    } else {
      onAdd(income)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-border/50 bg-card">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold">Ingresos</h3>
            <p className="text-xs text-muted-foreground">{incomes.length} fuente(s)</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-3.5" />
            Agregar
          </Button>
        </div>

        {incomes.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No hay ingresos cargados. Agregá al menos uno para planificar el mes.
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {incomes.map((income) => (
              <li
                key={income.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{income.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{income.category}</span>
                    <Badge variant={income.recurring ? 'secondary' : 'outline'} className="text-[10px]">
                      {income.recurring ? 'Recurrente' : 'Único'}
                    </Badge>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-600">
                  {formatCurrency(income.amount)}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => openEdit(income)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(income.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <IncomeFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        income={editing}
        onSubmit={handleSubmit}
      />
    </>
  )
}
