import { useState } from 'react'
import type { FixedObligation } from '@/types'
import type { FixedObligationFormValues } from '@/schemas/obligacionSchemas'
import { buildObligationPayload } from '@/utils/obligationMappers'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteObligationDialog } from '@/components/obligaciones/DeleteObligationDialog'
import { ObligationFormModal } from '@/components/obligaciones/ObligationFormModal'
import { ObligationsTable } from '@/components/obligaciones/ObligationsTable'
import { ObligationsToolbar } from '@/components/obligaciones/ObligationsToolbar'
import { getActionErrorMessage, useToast } from '@/context/ToastContext'
import { useFixedObligations } from '@/hooks/useFixedObligations'

export function ObligacionesPage() {
  const { toast } = useToast()
  const {
    isLoading,
    obligations,
    totalCount,
    filteredCount,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    typeNames,
    sortField,
    sortDirection,
    toggleSort,
    addObligation,
    updateObligation,
    removeObligation,
  } = useFixedObligations()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<FixedObligation | null>(null)
  const [deleting, setDeleting] = useState<FixedObligation | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (obligation: FixedObligation) => {
    setEditing(obligation)
    setFormOpen(true)
  }

  const openDelete = (obligation: FixedObligation) => {
    setDeleting(obligation)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (values: FixedObligationFormValues) => {
    const payload = buildObligationPayload(values.type, values.description)

    const entry = {
      name: payload.name,
      category: payload.category,
      description: payload.description,
      amount: values.amount,
    }

    try {
      if (editing) {
        await updateObligation({ ...editing, ...entry })
        toast.success('Obligación actualizada')
      } else {
        await addObligation(entry)
        toast.success('Obligación agregada')
      }
    } catch (err) {
      toast.error(
        'No se pudo guardar la obligación',
        getActionErrorMessage(err, 'Intentá de nuevo.'),
      )
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    try {
      await removeObligation(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
      toast.success('Obligación eliminada')
    } catch (err) {
      toast.error(
        'No se pudo eliminar la obligación',
        getActionErrorMessage(err, 'Intentá de nuevo.'),
      )
    }
  }

  if (isLoading) {
    return <PageListSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Obligaciones"
        description="Compromisos que se repiten cada mes: alquiler, servicios, tarjetas y más."
      />

      <ObligationsToolbar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        typeNames={typeNames}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onNew={openCreate}
      />

      <ObligationsTable
        obligations={obligations}
        totalCount={totalCount}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={toggleSort}
        onEdit={openEdit}
        onDelete={openDelete}
        onCreate={openCreate}
        onClearFilters={() => {
          setSearch('')
          setTypeFilter('all')
        }}
      />

      <ObligationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        obligation={editing}
        onSubmit={handleFormSubmit}
      />

      <DeleteObligationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        obligation={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
