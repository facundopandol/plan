import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import type { SavingsGoal } from '@/types'
import type { SavingsGoalFormValues } from '@/schemas/objetivoSchemas'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteGoalDialog } from '@/components/objetivos/DeleteGoalDialog'
import { GoalCard } from '@/components/objetivos/GoalCard'
import { GoalFormModal } from '@/components/objetivos/GoalFormModal'
import { Button } from '@/components/ui/button'
import { getActionErrorMessage, useToast } from '@/context/ToastContext'
import { useGoals, usePlan } from '@/hooks/usePlan'

export function ObjetivosPage() {
  const { toast } = useToast()
  const { isLoading } = usePlan()
  const { goals, addGoal, updateGoal, removeGoal } = useGoals()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<SavingsGoal | null>(null)
  const [deleting, setDeleting] = useState<SavingsGoal | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (goal: SavingsGoal) => {
    setEditing(goal)
    setFormOpen(true)
  }

  const openDelete = (goal: SavingsGoal) => {
    setDeleting(goal)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (values: SavingsGoalFormValues) => {
    try {
      if (editing) {
        await updateGoal({ ...editing, ...values })
        toast.success('Objetivo actualizado')
      } else {
        await addGoal(values)
        toast.success('Objetivo creado')
      }
    } catch (err) {
      toast.error('No se pudo guardar el objetivo', getActionErrorMessage(err, 'Intentá de nuevo.'))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    try {
      await removeGoal(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
      toast.success('Objetivo eliminado')
    } catch (err) {
      toast.error('No se pudo eliminar el objetivo', getActionErrorMessage(err, 'Intentá de nuevo.'))
    }
  }

  if (isLoading) {
    return <PageListSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Objetivos"
          description="Metas financieras a mediano y largo plazo."
        />
        <Button className="gap-2 shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Crear objetivo
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No tenés objetivos todavía"
          description="Creá tu primer objetivo para visualizar el progreso de ahorro a mediano y largo plazo."
          action={
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="size-4" />
              Crear objetivo
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onEdit={openEdit} onDelete={openDelete} />
          ))}
        </div>
      )}

      <GoalFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        goal={editing}
        onSubmit={handleFormSubmit}
      />

      <DeleteGoalDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        goal={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
