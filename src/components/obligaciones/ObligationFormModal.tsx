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
  const { options } = useObligationTypes()

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
      type: options[0]?.name ?? '',
      amount: 0,
      frequency: 'Mensual',
      dueDay: 1,
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
              ...parseObligationToForm(obligation.name),
              amount: obligation.amount,
              frequency: obligation.frequency,
              dueDay: obligation.dueDay,
              active: obligation.active,
            }
          : {
              type: options[0]?.name ?? '',
              amount: 0,
              frequency: 'Mensual',
              dueDay: 1,
              active: true,
            },
      )
    }
  }, [open, obligation, options, reset])

  const onFormSubmit = (values: FixedObligationFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar obligación' : 'Nueva obligación'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modificá los datos de esta obligación fija.'
              : 'Registrá un compromiso financiero recurrente o puntual.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(v) => setValue('type', v)}
              disabled={options.length === 0}
            >
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
            {options.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Agregá tipos desde &quot;Editar tipos&quot; antes de crear una obligación.
              </p>
            )}
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
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
              <Label htmlFor="obligation-dueDay">Día de vencimiento</Label>
              <Input
                id="obligation-dueDay"
                type="number"
                min={1}
                max={31}
                {...register('dueDay', { valueAsNumber: true })}
              />
              {errors.dueDay && (
                <p className="text-xs text-destructive">{errors.dueDay.message}</p>
              )}
            </div>
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
            <Button type="submit" disabled={options.length === 0}>
              {isEditing ? 'Guardar cambios' : 'Crear obligación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
