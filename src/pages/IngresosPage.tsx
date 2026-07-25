import { useState } from 'react'
import { Wallet } from 'lucide-react'
import type { IncomeEntry } from '@/types'
import type { IncomeEntryFormValues } from '@/schemas/ingresoSchemas'
import { PageListSkeleton } from '@/components/shared/PageListSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { DeleteIncomeDialog } from '@/components/ingresos/DeleteIncomeDialog'
import { IncomeFormModal } from '@/components/ingresos/IncomeFormModal'
import { IncomesTable } from '@/components/ingresos/IncomesTable'
import { IncomesToolbar } from '@/components/ingresos/IncomesToolbar'
import { getActionErrorMessage, useToast } from '@/context/ToastContext'
import { useMonthOptions, useSelectedMonth } from '@/hooks/usePlan'
import { useIncomeEntries } from '@/hooks/useIncomeEntries'
import { formatCurrency } from '@/utils/format'

export function IngresosPage() {
  const { toast } = useToast()
  const { selectedMonth } = useSelectedMonth()
  const months = useMonthOptions()
  const {
    isLoading,
    entries,
    monthlyTotal,
    totalCount,
    filteredCount,
    search,
    setSearch,
    sortDirection,
    toggleSort,
    createEntry,
    editEntry,
    deleteEntry,
  } = useIncomeEntries()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<IncomeEntry | null>(null)
  const [deleting, setDeleting] = useState<IncomeEntry | null>(null)

  const monthLabel = months.find((m) => m.value === selectedMonth)?.label ?? selectedMonth
  const defaultDate = `${selectedMonth}-01`

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (entry: IncomeEntry) => {
    setEditing(entry)
    setFormOpen(true)
  }

  const openDelete = (entry: IncomeEntry) => {
    setDeleting(entry)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (values: IncomeEntryFormValues) => {
    try {
      if (editing) {
        await editEntry({ ...editing, ...values })
        toast.success('Ingreso actualizado')
      } else {
        await createEntry(values)
        toast.success('Ingreso agregado')
      }
    } catch (err) {
      toast.error('No se pudo guardar el ingreso', getActionErrorMessage(err, 'Intentá de nuevo.'))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return
    try {
      await deleteEntry(deleting.id)
      setDeleteOpen(false)
      setDeleting(null)
      toast.success('Ingreso eliminado')
    } catch (err) {
      toast.error('No se pudo eliminar el ingreso', getActionErrorMessage(err, 'Intentá de nuevo.'))
    }
  }

  if (isLoading) {
    return <PageListSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingresos"
        description={`Registrá y administrá los ingresos de ${monthLabel.toLowerCase()}.`}
      />

      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-50/60 via-white to-card p-6 dark:from-emerald-950/50 dark:via-card dark:to-card">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingreso total del mes</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-300">
              {formatCurrency(monthlyTotal)}
            </p>
          </div>
        </div>
      </div>

      <IncomesToolbar
        search={search}
        onSearchChange={setSearch}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onNew={openCreate}
      />

      <IncomesTable
        entries={entries}
        totalCount={totalCount}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onEdit={openEdit}
        onDelete={openDelete}
        onCreate={openCreate}
        onClearSearch={() => setSearch('')}
      />

      <IncomeFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        entry={editing}
        defaultDate={defaultDate}
        onSubmit={handleFormSubmit}
      />

      <DeleteIncomeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entry={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
