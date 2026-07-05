import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Obligation } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ObligationFormModal } from '@/components/mes/ObligationFormModal'
import { formatCurrency, formatDate } from '@/utils/format'

interface ObligationSectionProps {
  obligations: Obligation[]
  onAdd: (obligation: Obligation) => void
  onUpdate: (obligation: Obligation) => void
  onRemove: (id: string) => void
}

export function ObligationSection({
  obligations,
  onAdd,
  onUpdate,
  onRemove,
}: ObligationSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Obligation | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (obligation: Obligation) => {
    setEditing(obligation)
    setModalOpen(true)
  }

  const handleSubmit = (obligation: Obligation) => {
    if (editing) {
      onUpdate(obligation)
    } else {
      onAdd(obligation)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-border/50 bg-card">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold">Obligaciones</h3>
            <p className="text-xs text-muted-foreground">{obligations.length} compromiso(s)</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={openCreate}>
            <Plus className="size-3.5" />
            Agregar
          </Button>
        </div>

        {obligations.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No hay obligaciones cargadas. Agregá tus compromisos del mes.
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {obligations.map((obligation) => (
              <li
                key={obligation.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{obligation.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(obligation.dueDate)}
                    </span>
                    <Badge variant={obligation.paid ? 'success' : 'warning'} className="text-[10px]">
                      {obligation.paid ? 'Pagado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-amber-600">
                  {formatCurrency(obligation.amount)}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => openEdit(obligation)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(obligation.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ObligationFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        obligation={editing}
        onSubmit={handleSubmit}
      />
    </>
  )
}
