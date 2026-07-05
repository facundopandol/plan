import type { InvestmentEntry } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/utils/format'

interface DeleteInvestmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: InvestmentEntry | null
  onConfirm: () => void
}

export function DeleteInvestmentDialog({
  open,
  onOpenChange,
  entry,
  onConfirm,
}: DeleteInvestmentDialogProps) {
  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar inversión</DialogTitle>
          <DialogDescription>
            ¿Eliminar el registro de inversión del{' '}
            <span className="font-medium text-foreground">{formatDate(entry.date)}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <span className="font-medium">{entry.type}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Monto</span>
            <span className="font-medium tabular-nums">{formatCurrency(entry.amount)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{entry.comment}</p>
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
