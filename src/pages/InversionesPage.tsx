import { useState } from 'react'
import type { InvestmentEntry } from '@/types'
import type { InvestmentEntryFormValues } from '@/schemas/inversionSchemas'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteInvestmentDialog } from '@/components/inversiones/DeleteInvestmentDialog'
import { InvestmentDistribution } from '@/components/inversiones/InvestmentDistribution'
import { InvestmentEntriesList } from '@/components/inversiones/InvestmentEntriesList'
import { InvestmentFormModal } from '@/components/inversiones/InvestmentFormModal'
import { InvestmentMonthlyTotal } from '@/components/inversiones/InvestmentMonthlyTotal'
import { useMonthOptions, useSelectedMonth } from '@/hooks/usePlan'
import { useInvestmentEntries } from '@/hooks/useInvestmentEntries'

export function InversionesPage() {
  const { selectedMonth } = useSelectedMonth()
  const months = useMonthOptions()
  const {
    isLoading,
    goals,
    entries,
    monthlyTotal,
    distribution,
    createEntry,
    editEntry,
    deleteEntry,
  } = useInvestmentEntries()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<InvestmentEntry | null>(null)
  const [deleting, setDeleting] = useState<InvestmentEntry | null>(null)

  const monthLabel = months.find((m) => m.value === selectedMonth)?.label ?? selectedMonth
  const defaultDate = `${selectedMonth}-01`

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (entry: InvestmentEntry) => {
    setEditing(entry)
    setFormOpen(true)
  }

  const openDelete = (entry: InvestmentEntry) => {
    setDeleting(entry)
    setDeleteOpen(true)
  }

  const handleFormSubmit = (values: InvestmentEntryFormValues) => {
    if (editing) {
      editEntry({ ...editing, ...values, comment: values.comment ?? '' })
    } else {
      createEntry({ ...values, comment: values.comment ?? '' })
    }
  }

  const handleDeleteConfirm = () => {
    if (deleting) {
      deleteEntry(deleting.id)
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
        title="Ahorro e Inversiones"
        description="Registrá cómo distribuís el capital que reservaste para ahorro e inversiones este mes."
      />

      <InvestmentMonthlyTotal total={monthlyTotal} monthLabel={monthLabel} />

      <InvestmentDistribution items={distribution} total={monthlyTotal} />

      <InvestmentEntriesList
        entries={entries}
        goals={goals}
        onNew={openCreate}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <InvestmentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editing}
        defaultDate={defaultDate}
        onSubmit={handleFormSubmit}
      />

      <DeleteInvestmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entry={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
