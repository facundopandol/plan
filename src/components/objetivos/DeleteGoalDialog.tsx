import type { SavingsGoal } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/utils/format'
import { getGoalProgress } from '@/utils/goal'

interface DeleteGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: SavingsGoal | null
  onConfirm: () => void
}

export function DeleteGoalDialog({ open, onOpenChange, goal, onConfirm }: DeleteGoalDialogProps) {
  if (!goal) return null

  const progress = getGoalProgress(goal.savedAmount, goal.targetAmount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar objetivo</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que querés eliminar{' '}
            <span className="font-medium text-foreground">{goal.name}</span>? Se perderá el
            registro del progreso ({progress}%).
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ahorrado</span>
            <span className="font-medium tabular-nums">{formatCurrency(goal.savedAmount)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Objetivo</span>
            <span className="font-medium tabular-nums">{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Fecha meta</span>
            <span className="font-medium">{formatDate(goal.targetDate)}</span>
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
