import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FixedObligation } from '@/types'
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
  fixedObligationFormSchema,
  OBLIGATION_FREQUENCIES,
  type FixedObligationFormValues,
} from '@/schemas/obligacionSchemas'
import { useObligationTypes } from '@/hooks/useObligationTypes'
import { parseObligationToForm } from '@/utils/obligationMappers'

interface ObligationFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  obligation?: FixedObligation | null
  onSubmit: (values: FixedObligationFormValues) => void
}

export function ObligationFormModal({
  open,
  onOpenChange,
  obligation,
  onSubmit,
}: ObligationFormModalProps) {
  const isEditing = Boolean(obligation)
  const { options } = useObligationTypes(obligation?.category)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FixedObligationFormValues>({
    resolver: zodResolver(fixedObligationFormSchema),
    defaultValues: {
      type: 'Alquiler',
      description: '',
      amount: 0,
      frequency: 'Mensual',
      active: true,
    },
  })

  const type = watch('type')
  const frequency = watch('frequency')
  const active = watch('active')

  useEffect(() => {
    if (open) {
      reset(
        obligation
          ? {
              ...parseObligationToForm(obligation),
              amount: obligation.amount,
              frequency: obligation.frequency === 'Anual' ? 'Anual' : 'Mensual',
              active: obligation.active,
            }
          : {
              type: 'Alquiler',
              description: '',
              amount: 0,
              frequency: 'Mensual',
              active: true,
            },
      )
    }
  }, [open, obligation, reset])

  const onFormSubmit = (values: FixedObligationFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  const descriptionPlaceholder =
    type === 'Tarjetas'
      ? 'Ej. Visa, Amex, Master...'
      : type === 'Servicios'
        ? 'Ej. Luz, Gas, Internet...'
        : 'Detalle opcional'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar obligación' : 'Nueva obligación'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modificá el monto y la frecuencia de este compromiso.'
              : 'Definí cuánto reservar por tipo. Solo montos, sin fechas de pago.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setValue('type', v as FixedObligationFormValues['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {options.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="obligation-description">Detalle (opcional)</Label>
            <Input
              id="obligation-description"
              placeholder={descriptionPlaceholder}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select
                value={frequency}
                onValueChange={(v) =>
                  setValue('frequency', v as FixedObligationFormValues['frequency'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {OBLIGATION_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="text-xs text-destructive">{errors.frequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="obligation-amount">Monto</Label>
              <Input
                id="obligation-amount"
                type="number"
                min={0}
                step={1000}
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activa</Label>
            <Select
              value={active ? 'yes' : 'no'}
              onValueChange={(v) => setValue('active', v === 'yes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Crear obligación'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
