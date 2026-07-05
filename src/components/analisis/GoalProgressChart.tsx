import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GoalProgressPoint } from '@/types/analytics'
import { CHART_COLORS, formatChartTooltip } from '@/utils/chart'

interface GoalProgressChartProps {
  data: GoalProgressPoint[]
}

export function GoalProgressChart({ data }: GoalProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Todavía no tenés objetivos cargados
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: CHART_COLORS.muted }} unit="%" />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
        />
        <Tooltip
          formatter={(value, _name, item) => {
            const payload = item.payload as GoalProgressPoint
            return [`${Number(value ?? 0)}% · ${formatChartTooltip(payload.savedAmount)}`, 'Progreso']
          }}
          contentStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="percentage" name="Progreso" fill={CHART_COLORS.freeMoney} radius={[0, 4, 4, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
