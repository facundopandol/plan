import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyEvolutionPoint } from '@/types/analytics'
import { CHART_COLORS, formatChartAxis, formatChartTooltip } from '@/utils/chart'

interface EvolutionLineChartProps {
  data: MonthlyEvolutionPoint[]
  dataKey: keyof Pick<
    MonthlyEvolutionPoint,
    'freeMoney' | 'income' | 'obligations' | 'reserved'
  >
  color: string
}

export function EvolutionLineChart({ data, dataKey, color }: EvolutionLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatChartAxis}
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
                <p className="font-medium">{label}</p>
                <p className="mt-1 tabular-nums" style={{ color }}>
                  {formatChartTooltip(payload[0].value as number)}
                </p>
              </div>
            )
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
