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
import { useMonthOptions, useSelectedMonth } from '@/hooks/usePlan'
import { useIncomeEntries } from '@/hooks/useIncomeEntries'
import { formatCurrency } from '@/utils/format'

export function IngresosPage() {
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

  const handleFormSubmit = (values: IncomeEntryFormValues) => {
    if (editing) {
      editEntry({ ...editing, ...values })
    } else {
      createEntry(values)
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
        title="Ingresos"
        description={`Registrá y administrá los ingresos de ${monthLabel.toLowerCase()}.`}
      />

      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-50/60 via-white to-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ingreso total del mes</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-emerald-700">
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
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onEdit={openEdit}
        onDelete={openDelete}
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
