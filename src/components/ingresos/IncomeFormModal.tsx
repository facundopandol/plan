import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { IncomeEntry } from '@/types'
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
  INCOME_TYPES,
  incomeEntryFormSchema,
  type IncomeEntryFormValues,
} from '@/schemas/ingresoSchemas'
import { resolveIncomeDescription } from '@/utils/incomeMappers'

interface IncomeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: IncomeEntry | null
  defaultDate?: string
  onSubmit: (values: IncomeEntryFormValues) => void
}

export function IncomeFormModal({
  open,
  onOpenChange,
  entry,
  defaultDate,
  onSubmit,
}: IncomeFormModalProps) {
  const isEditing = Boolean(entry)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncomeEntryFormValues>({
    resolver: zodResolver(incomeEntryFormSchema),
    defaultValues: {
      date: defaultDate ?? new Date().toISOString().slice(0, 10),
      type: 'Sueldo',
      description: '',
      amount: 0,
    },
  })

  const type = watch('type')
  const showDescription = type === 'Otro'

  useEffect(() => {
    if (open) {
      reset(
        entry
          ? {
              date: entry.date,
              type: entry.type,
              description: entry.type === 'Otro' ? entry.description : '',
              amount: entry.amount,
            }
          : {
              date: defaultDate ?? new Date().toISOString().slice(0, 10),
              type: 'Sueldo',
              description: '',
              amount: 0,
            },
      )
    }
  }, [open, entry, defaultDate, reset])

  const onFormSubmit = (values: IncomeEntryFormValues) => {
    onSubmit({
      ...values,
      description: resolveIncomeDescription(values.type, values.description),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar ingreso' : 'Nuevo ingreso'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modificá los datos de este ingreso.'
              : 'Registrá un ingreso para el mes seleccionado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="income-date">Fecha</Label>
              <Input id="income-date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setValue('type', v as IncomeEntryFormValues['type'])
                  if (v !== 'Otro') setValue('description', '')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
          </div>

          {showDescription && (
            <div className="space-y-2">
              <Label htmlFor="income-description">Descripción</Label>
              <Input
                id="income-description"
                placeholder="Ej. Freelance diseño, venta usado..."
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          )}

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

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Registrar ingreso'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
