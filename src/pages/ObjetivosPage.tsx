import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import type { SavingsGoal } from '@/types'
import type { SavingsGoalFormValues } from '@/schemas/objetivoSchemas'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteGoalDialog } from '@/components/objetivos/DeleteGoalDialog'
import { GoalCard } from '@/components/objetivos/GoalCard'
import { GoalFormModal } from '@/components/objetivos/GoalFormModal'
import { Button } from '@/components/ui/button'
import { useGoals, usePlan } from '@/hooks/usePlan'

export function ObjetivosPage() {
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

  const handleFormSubmit = (values: SavingsGoalFormValues) => {
    if (editing) {
      updateGoal({ ...editing, ...values })
    } else {
      addGoal(values)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleting) {
      removeGoal(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
            <Target className="size-6" />
          </div>
          <p className="mt-4 text-sm font-medium">No tenés objetivos todavía</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Creá tu primer objetivo para empezar a visualizar tu progreso de ahorro.
          </p>
          <Button className="mt-4 gap-2" onClick={openCreate}>
            <Plus className="size-4" />
            Crear objetivo
          </Button>
        </div>
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
