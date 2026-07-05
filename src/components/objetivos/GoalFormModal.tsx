import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { GoalColor, GoalIcon, SavingsGoal } from '@/types'
import { GoalIconDisplay } from '@/components/objetivos/GoalIconDisplay'
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
  GOAL_COLOR_OPTIONS,
  GOAL_ICON_OPTIONS,
  savingsGoalFormSchema,
  type SavingsGoalFormValues,
} from '@/schemas/objetivoSchemas'
import { cn } from '@/lib/utils'
import { GOAL_COLOR_STYLES } from '@/utils/goal'

interface GoalFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: SavingsGoal | null
  onSubmit: (values: SavingsGoalFormValues) => void
}

export function GoalFormModal({ open, onOpenChange, goal, onSubmit }: GoalFormModalProps) {
  const isEditing = Boolean(goal)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: {
      name: '',
      targetAmount: 0,
      savedAmount: 0,
      targetDate: '',
      icon: 'Target',
      color: 'emerald',
    },
  })

  const icon = watch('icon')
  const color = watch('color')

  useEffect(() => {
    if (open) {
      reset(
        goal
          ? {
              name: goal.name,
              targetAmount: goal.targetAmount,
              savedAmount: goal.savedAmount,
              targetDate: goal.targetDate,
              icon: goal.icon,
              color: goal.color,
            }
          : {
              name: '',
              targetAmount: 0,
              savedAmount: 0,
              targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                .toISOString()
                .slice(0, 10),
              icon: 'Target',
              color: 'emerald',
            },
      )
    }
  }, [open, goal, reset])

  const onFormSubmit = (values: SavingsGoalFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar objetivo' : 'Crear objetivo'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modificá los datos de tu meta de ahorro.'
              : 'Definí una nueva meta financiera a alcanzar.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Nombre</Label>
            <Input id="goal-name" placeholder="Ej. Viaje a Europa" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Monto objetivo</Label>
              <Input
                id="goal-target"
                type="number"
                min={0}
                step={1000}
                {...register('targetAmount', { valueAsNumber: true })}
              />
              {errors.targetAmount && (
                <p className="text-xs text-destructive">{errors.targetAmount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-saved">Monto ahorrado</Label>
              <Input
                id="goal-saved"
                type="number"
                min={0}
                step={1000}
                {...register('savedAmount', { valueAsNumber: true })}
              />
              {errors.savedAmount && (
                <p className="text-xs text-destructive">{errors.savedAmount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-date">Fecha objetivo</Label>
            <Input id="goal-date" type="date" {...register('targetDate')} />
            {errors.targetDate && (
              <p className="text-xs text-destructive">{errors.targetDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ícono</Label>
            <div className="grid grid-cols-5 gap-2">
              {GOAL_ICON_OPTIONS.map((iconOption) => (
                <button
                  key={iconOption}
                  type="button"
                  onClick={() => setValue('icon', iconOption)}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg border transition-colors',
                    icon === iconOption
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40',
                  )}
                >
                  <GoalIconDisplay icon={iconOption as GoalIcon} className="size-4" />
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-xs text-destructive">{errors.icon.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {GOAL_COLOR_OPTIONS.map((colorOption) => {
                const styles = GOAL_COLOR_STYLES[colorOption as GoalColor]
                return (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setValue('color', colorOption)}
                    className={cn(
                      'size-8 rounded-full border-2 transition-all',
                      styles.bar,
                      color === colorOption
                        ? 'scale-110 border-foreground'
                        : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                    aria-label={colorOption}
                  />
                )
              })}
            </div>
            {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Crear objetivo'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
