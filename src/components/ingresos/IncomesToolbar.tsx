import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface IncomesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filteredCount: number
  totalCount: number
  onNew: () => void
}

export function IncomesToolbar({
  search,
  onSearchChange,
  filteredCount,
  totalCount,
  onNew,
}: IncomesToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por descripción o tipo..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredCount === totalCount
            ? `${totalCount} ingreso${totalCount !== 1 ? 's' : ''}`
            : `${filteredCount} de ${totalCount}`}
        </p>
        <Button className="gap-2" onClick={onNew}>
          <Plus className="size-4" />
          Nuevo ingreso
        </Button>
      </div>
    </div>
  )
}
