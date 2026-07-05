import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Income } from '@/types'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  INCOME_CATEGORIES,
  incomeFormSchema,
  type IncomeFormValues,
} from '@/schemas/mesSchemas'
import { generateId } from '@/utils/calculateSummary'

interface IncomeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  income?: Income | null
  onSubmit: (income: Income) => void
}

export function IncomeFormModal({
  open,
  onOpenChange,
  income,
  onSubmit,
}: IncomeFormModalProps) {
  const isEditing = Boolean(income)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      name: '',
      amount: 0,
      category: 'Trabajo',
      recurring: true,
    },
  })

  const category = watch('category')
  const recurring = watch('recurring')

  useEffect(() => {
    if (open) {
      reset(
        income
          ? {
              name: income.name,
              amount: income.amount,
              category: income.category,
              recurring: income.recurring,
            }
          : {
              name: '',
              amount: 0,
              category: 'Trabajo',
              recurring: true,
            },
      )
    }
  }, [open, income, reset])

  const onFormSubmit = (values: IncomeFormValues) => {
    onSubmit({
      id: income?.id ?? generateId(),
      ...values,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar ingreso' : 'Agregar ingreso'}</DialogTitle>
          <DialogDescription>
            Registrá una fuente de ingreso planificada para el mes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income-name">Nombre</Label>
            <Input id="income-name" placeholder="Ej. Salario" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-amount">Monto</Label>
            <Input
              id="income-amount"
              type="number"
              min={0}
              step={1000}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={category} onValueChange={(v) => setValue('category', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="income-recurring"
              type="checkbox"
              checked={recurring}
              onChange={(e) => setValue('recurring', e.target.checked)}
              className="size-4 rounded border-input"
            />
            <Label htmlFor="income-recurring">Ingreso recurrente</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar' : 'Agregar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
