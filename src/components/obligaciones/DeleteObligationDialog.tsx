import type { FixedObligation } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/format'

interface DeleteObligationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  obligation: FixedObligation | null
  onConfirm: () => void
}

export function DeleteObligationDialog({
  open,
  onOpenChange,
  obligation,
  onConfirm,
}: DeleteObligationDialogProps) {
  if (!obligation) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar obligación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar{' '}
            <span className="font-medium text-foreground">{obligation.name}</span>? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto</span>
            <span className="font-medium tabular-nums">{formatCurrency(obligation.amount)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Frecuencia</span>
            <span className="font-medium">{obligation.frequency}</span>
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
