import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryRanking } from '@/types/analytics'
import { CHART_COLORS, formatChartTooltip } from '@/utils/chart'

const CATEGORY_COLORS = [
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#71717a',
]

interface TopCategoriesChartProps {
  data: CategoryRanking[]
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fontSize: 12, fill: CHART_COLORS.muted }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const item = payload[0].payload as CategoryRanking
            return (
              <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
                <p className="font-medium">{item.category}</p>
                <p className="mt-1 tabular-nums">{formatChartTooltip(item.amount)}</p>
                <p className="text-muted-foreground">{item.percentage}% del total</p>
              </div>
            )
          }}
        />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((_, index) => (
            <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
