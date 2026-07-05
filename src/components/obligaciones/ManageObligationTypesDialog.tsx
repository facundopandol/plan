import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
import { useObligationTypes } from '@/hooks/useObligationTypes'
import { isManagedObligationType, isObligationTypeInUse } from '@/utils/obligationMappers'

interface ManageObligationTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageObligationTypesDialog({
  open,
  onOpenChange,
}: ManageObligationTypesDialogProps) {
  const { managedTypes, fixedObligations, monthObligations, addType, removeType } =
    useObligationTypes()
  const [newType, setNewType] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const trimmed = newType.trim()
    if (!trimmed) {
      setError('Ingresá un nombre para el tipo')
      return
    }

    if (managedTypes.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Ese tipo ya existe')
      return
    }

    addType(trimmed)
    setNewType('')
    setError('')
  }

  const handleRemove = (id: string, name: string) => {
    if (isObligationTypeInUse(name, fixedObligations, monthObligations)) {
      setError(`"${name}" está en uso. Eliminá las obligaciones asociadas primero.`)
      return
    }

    removeType(id)
    setError('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tipos de obligación</DialogTitle>
          <DialogDescription>
            Personalizá el listado de tipos. Por ejemplo: Tarjetas de crédito, Gimnasio, etc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-obligation-type">Agregar tipo</Label>
            <div className="flex gap-2">
              <Input
                id="new-obligation-type"
                placeholder="Ej. Tarjetas de crédito"
                value={newType}
                onChange={(e) => {
                  setNewType(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdd()
                  }
                }}
              />
              <Button type="button" onClick={handleAdd} className="shrink-0 gap-1.5">
                <Plus className="size-4" />
                Agregar
              </Button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border/50 p-2">
            {managedTypes.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                No hay tipos configurados.
              </p>
            ) : (
              managedTypes.map((type) => {
                const inUse = isObligationTypeInUse(type.name, fixedObligations, monthObligations)
                return (
                  <div
                    key={type.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/30"
                  >
                    <span className="text-sm font-medium">{type.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      disabled={!isManagedObligationType(type.id) || inUse}
                      title={
                        inUse
                          ? 'No se puede eliminar: hay obligaciones usando este tipo'
                          : 'Eliminar tipo'
                      }
                      onClick={() => handleRemove(type.id, type.name)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
