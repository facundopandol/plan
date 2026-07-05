import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Obligation } from '@/types'
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
  obligationFormSchema,
  type ObligationFormValues,
} from '@/schemas/mesSchemas'
import { useObligationTypes } from '@/hooks/useObligationTypes'
import { generateId } from '@/utils/calculateSummary'
import { parseObligationToForm, resolveObligationName } from '@/utils/obligationMappers'

interface ObligationFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  obligation?: Obligation | null
  onSubmit: (obligation: Obligation) => void
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
  } = useForm<ObligationFormValues>({
    resolver: zodResolver(obligationFormSchema),
    defaultValues: {
      type: options[0]?.name ?? '',
      amount: 0,
      dueDate: '',
      paid: false,
    },
  })

  const type = watch('type')
  const paid = watch('paid')

  useEffect(() => {
    if (open) {
      reset(
        obligation
          ? {
              ...parseObligationToForm(obligation.name),
              amount: obligation.amount,
              dueDate: obligation.dueDate,
              paid: obligation.paid,
            }
          : {
              type: options[0]?.name ?? '',
              amount: 0,
              dueDate: new Date().toISOString().slice(0, 10),
              paid: false,
            },
      )
    }
  }, [open, obligation, options, reset])

  const onFormSubmit = (values: ObligationFormValues) => {
    const name = resolveObligationName(values.type)
    onSubmit({
      id: obligation?.id ?? generateId(),
      name,
      amount: values.amount,
      dueDate: values.dueDate,
      category: name,
      paid: values.paid,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar obligación' : 'Agregar obligación'}
          </DialogTitle>
          <DialogDescription>
            Compromiso financiero del mes, no un gasto diario.
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
                Agregá tipos en la pestaña Obligaciones → Editar tipos.
              </p>
            )}
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
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
            <Label htmlFor="obligation-dueDate">Vencimiento</Label>
            <Input id="obligation-dueDate" type="date" {...register('dueDate')} />
            {errors.dueDate && (
              <p className="text-xs text-destructive">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="obligation-paid"
              type="checkbox"
              checked={paid}
              onChange={(e) => setValue('paid', e.target.checked)}
              className="size-4 rounded border-input"
            />
            <Label htmlFor="obligation-paid">Ya pagado</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={options.length === 0}>
              {isEditing ? 'Guardar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
