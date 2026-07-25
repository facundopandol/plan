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
import { getActionErrorMessage, useToast } from '@/context/ToastContext'
import { useMonthOptions, useSelectedMonth } from '@/hooks/usePlan'
import { useInvestmentEntries } from '@/hooks/useInvestmentEntries'

export function InversionesPage() {
  const { toast } = useToast()
  const { selectedMonth } = useSelectedMonth()
  const months = useMonthOptions()
  const {
    isLoading,
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

  const handleFormSubmit = async (values: InvestmentEntryFormValues) => {
    const payload = {
      date: values.date,
      type: values.type,
      amount: values.amount,
      comment: values.comment?.trim() || undefined,
      goalId: undefined,
      personalName: undefined,
    }

    try {
      if (editing) {
        await editEntry({ ...editing, ...payload })
        toast.success('Movimiento actualizado')
      } else {
        await createEntry(payload)
        toast.success(
          values.type === 'Ahorro' ? 'Ahorro registrado' : 'Inversión registrada',
        )
      }
    } catch (err) {
      toast.error(
        'No se pudo guardar el movimiento',
        getActionErrorMessage(err, 'Intentá de nuevo.'),
      )
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    try {
      await deleteEntry(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
      toast.success('Movimiento eliminado')
    } catch (err) {
      toast.error(
        'No se pudo eliminar el movimiento',
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
        title="Ahorro e Inversiones"
        description="Seguí cuánto reservaste este mes: solo ahorro o inversión, sin detalle del instrumento."
      />

      <InvestmentMonthlyTotal total={monthlyTotal} monthLabel={monthLabel} />

      <InvestmentDistribution items={distribution} total={monthlyTotal} />

      <InvestmentEntriesList
        entries={entries}
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
