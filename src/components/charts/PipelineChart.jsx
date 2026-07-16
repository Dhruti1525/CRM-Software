import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 rounded-lg shadow-card px-3 py-2 text-xs">
      <p className="font-semibold text-navy-900 dark:text-slate-100">{p.label}</p>
      <p className="text-slate-400">{p.count} deals</p>
    </div>
  )
}

export default function PipelineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(111,92,255,0.06)' }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={44}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
