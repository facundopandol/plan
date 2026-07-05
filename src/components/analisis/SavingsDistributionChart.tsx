import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DestinationDistribution } from '@/types/analytics'
import { CHART_COLORS, formatChartAxis, formatChartTooltip } from '@/utils/chart'

interface SavingsDistributionChartProps {
  data: DestinationDistribution[]
}

export function SavingsDistributionChart({ data }: SavingsDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Sin destinos registrados en el mes actual
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis type="number" tickFormatter={formatChartAxis} tick={{ fontSize: 11, fill: CHART_COLORS.muted }} />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
        />
        <Tooltip
          formatter={(value) => formatChartTooltip(Number(value ?? 0))}
          contentStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="amount" name="Monto" fill={CHART_COLORS.reserved} radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
