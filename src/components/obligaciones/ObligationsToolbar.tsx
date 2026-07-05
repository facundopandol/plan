import { Plus, Search, Settings2 } from 'lucide-react'
import type { ObligationFrequency } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OBLIGATION_FREQUENCIES } from '@/schemas/obligacionSchemas'

interface ObligationsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  typeNames: string[]
  frequencyFilter: ObligationFrequency | 'all'
  onFrequencyFilterChange: (value: ObligationFrequency | 'all') => void
  filteredCount: number
  totalCount: number
  onManageTypes: () => void
  onNew: () => void
}

export function ObligationsToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  typeNames,
  frequencyFilter,
  onFrequencyFilterChange,
  filteredCount,
  totalCount,
  onManageTypes,
  onNew,
}: ObligationsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredCount === totalCount
              ? `${totalCount} obligación${totalCount !== 1 ? 'es' : ''}`
              : `${filteredCount} de ${totalCount} obligaciones`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={onManageTypes}>
            <Settings2 className="size-4" />
            Editar tipos
          </Button>
          <Button className="gap-2" onClick={onNew}>
            <Plus className="size-4" />
            Nueva Obligación
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por tipo..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {typeNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={frequencyFilter}
          onValueChange={(v) => onFrequencyFilterChange(v as ObligationFrequency | 'all')}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="Frecuencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las frecuencias</SelectItem>
            {OBLIGATION_FREQUENCIES.map((freq) => (
              <SelectItem key={freq} value={freq}>
                {freq}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
