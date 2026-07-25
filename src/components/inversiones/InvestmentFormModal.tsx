import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { InvestmentEntry } from '@/types'
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
  DESTINATION_TYPES,
  investmentEntryFormSchema,
  type InvestmentEntryFormValues,
} from '@/schemas/inversionSchemas'

interface InvestmentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry?: InvestmentEntry | null
  defaultDate?: string
  onSubmit: (values: InvestmentEntryFormValues) => void
}

export function InvestmentFormModal({
  open,
  onOpenChange,
  entry,
  defaultDate,
  onSubmit,
}: InvestmentFormModalProps) {
  const isEditing = Boolean(entry)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvestmentEntryFormValues>({
    resolver: zodResolver(investmentEntryFormSchema),
    defaultValues: {
      date: defaultDate ?? new Date().toISOString().slice(0, 10),
      type: 'Ahorro',
      amount: 0,
      comment: '',
    },
  })

  const type = watch('type')

  useEffect(() => {
    if (open) {
      reset(
        entry
          ? {
              date: entry.date,
              type: entry.type,
              amount: entry.amount,
              comment: entry.comment ?? '',
            }
          : {
              date: defaultDate ?? new Date().toISOString().slice(0, 10),
              type: 'Ahorro',
              amount: 0,
              comment: '',
            },
      )
    }
  }, [open, entry, defaultDate, reset])

  const onFormSubmit = (values: InvestmentEntryFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar movimiento' : 'Nuevo movimiento'}</DialogTitle>
          <DialogDescription>
            Registrá cuánto destinaste a ahorro o a inversión este mes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <input type="hidden" {...register('date')} />

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) =>
                setValue('type', value as InvestmentEntryFormValues['type'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {DESTINATION_TYPES.map((destinationType) => (
                  <SelectItem key={destinationType} value={destinationType}>
                    {destinationType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment-amount">Monto</Label>
            <Input
              id="investment-amount"
              type="number"
              min={0}
              step={1000}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment-comment">Comentario (opcional)</Label>
            <Input
              id="investment-comment"
              placeholder="Ej. Aporte mensual"
              {...register('comment')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Registrar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
