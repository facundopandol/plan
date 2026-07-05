import type { IncomeEntry } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/utils/format'
import { getIncomeEntryLabel } from '@/utils/incomeMappers'

interface DeleteIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: IncomeEntry | null
  onConfirm: () => void
}

export function DeleteIncomeDialog({
  open,
  onOpenChange,
  entry,
  onConfirm,
}: DeleteIncomeDialogProps) {
  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar ingreso</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar{' '}
            <span className="font-medium text-foreground">{getIncomeEntryLabel(entry)}</span>? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha</span>
            <span className="font-medium">{formatDate(entry.date)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <span className="font-medium">{entry.type}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Monto</span>
            <span className="font-medium tabular-nums">{formatCurrency(entry.amount)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
