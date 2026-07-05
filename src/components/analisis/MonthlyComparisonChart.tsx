import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyEvolutionPoint } from '@/types/analytics'
import { CHART_COLORS, formatChartAxis, formatChartTooltip } from '@/utils/chart'

interface MonthlyComparisonChartProps {
  data: MonthlyEvolutionPoint[]
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barGap={4}>
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
                <p className="mb-2 font-medium">{label}</p>
                {payload.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatChartTooltip(entry.value as number)}
                    </span>
                  </div>
                ))}
              </div>
            )
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
        <Bar
          dataKey="income"
          name="Ingresos"
          fill={CHART_COLORS.income}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="obligations"
          name="Obligaciones"
          fill={CHART_COLORS.obligations}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="reserved"
          name="Ahorro / Inversión"
          fill={CHART_COLORS.reserved}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="freeMoney"
          name="Dinero libre"
          fill={CHART_COLORS.freeMoney}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
