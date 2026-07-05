import { useState } from 'react'
import type { FixedObligation } from '@/types'
import type { FixedObligationFormValues } from '@/schemas/obligacionSchemas'
import { resolveObligationName } from '@/utils/obligationMappers'
import { ManageObligationTypesDialog } from '@/components/obligaciones/ManageObligationTypesDialog'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteObligationDialog } from '@/components/obligaciones/DeleteObligationDialog'
import { ObligationFormModal } from '@/components/obligaciones/ObligationFormModal'
import { ObligationsTable } from '@/components/obligaciones/ObligationsTable'
import { ObligationsToolbar } from '@/components/obligaciones/ObligationsToolbar'
import { useFixedObligations } from '@/hooks/useFixedObligations'

export function ObligacionesPage() {
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
    frequencyFilter,
    setFrequencyFilter,
    sortField,
    sortDirection,
    toggleSort,
    addObligation,
    updateObligation,
    removeObligation,
  } = useFixedObligations()

  const [formOpen, setFormOpen] = useState(false)
  const [typesOpen, setTypesOpen] = useState(false)
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

  const handleFormSubmit = (values: FixedObligationFormValues) => {
    const payload = {
      name: resolveObligationName(values.type),
      category: resolveObligationName(values.type),
      amount: values.amount,
      frequency: values.frequency,
      dueDay: values.dueDay,
      active: values.active,
    }

    if (editing) {
      updateObligation({ ...editing, ...payload })
    } else {
      addObligation(payload)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleting) {
      removeObligation(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
    }
  }

  if (isLoading) {
    return <PageListSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Obligaciones"
        description="Administrá todos tus compromisos financieros fijos del mes."
      />

      <ObligationsToolbar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        typeNames={typeNames}
        frequencyFilter={frequencyFilter}
        onFrequencyFilterChange={setFrequencyFilter}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onManageTypes={() => setTypesOpen(true)}
        onNew={openCreate}
      />

      <ObligationsTable
        obligations={obligations}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={toggleSort}
        onEdit={openEdit}
        onDelete={openDelete}
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

      <ManageObligationTypesDialog open={typesOpen} onOpenChange={setTypesOpen} />
    </div>
  )
}
