import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  investmentGoalFormSchema,
  type InvestmentGoalFormValues,
} from '@/schemas/mesSchemas'
import { formatCurrency } from '@/utils/format'

interface InvestmentGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGoal: number
  available: number
  onSubmit: (amount: number) => void
}

export function InvestmentGoalModal({
  open,
  onOpenChange,
  currentGoal,
  available,
  onSubmit,
}: InvestmentGoalModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InvestmentGoalFormValues>({
    resolver: zodResolver(investmentGoalFormSchema),
    defaultValues: { amount: currentGoal },
  })

  const amount = watch('amount')

  useEffect(() => {
    if (open) {
      reset({ amount: currentGoal })
    }
  }, [open, currentGoal, reset])

  const onFormSubmit = (values: InvestmentGoalFormValues) => {
    onSubmit(values.amount)
    onOpenChange(false)
  }

  const projectedFree = available - (Number.isFinite(amount) ? amount : 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Objetivo de inversión</DialogTitle>
          <DialogDescription>
            Definí cuánto del disponible querés destinar a invertir este mes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Disponible: </span>
            <span className="font-semibold tabular-nums">{formatCurrency(available)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment-amount">Monto a invertir</Label>
            <Input
              id="investment-amount"
              type="number"
              min={0}
              step={1000}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="rounded-lg border border-border/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Dinero libre resultante: </span>
            <span
              className={
                projectedFree < 0
                  ? 'font-semibold tabular-nums text-red-600'
                  : 'font-semibold tabular-nums text-teal-600'
              }
            >
              {formatCurrency(projectedFree)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Definir objetivo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
