import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/common/Card'
import RevenueChart from '../components/charts/RevenueChart'
import CustomerGrowthChart from '../components/charts/CustomerGrowthChart'
import { fetchPipeline } from '../redux/slices/leadsSlice'
import { fetchSales } from '../redux/slices/salesSlice'
import { formatCurrency } from '../utils/formatters'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

export default function Analytics() {
  const dispatch = useDispatch()
  const { pipeline } = useSelector((s) => s.leads)
  const { carts } = useSelector((s) => s.sales)

  useEffect(() => {
    dispatch(fetchPipeline())
    dispatch(fetchSales())
  }, [dispatch])

  const revenueData = useMemo(() => {
    if (!carts.length) return []
    return MONTHS.map((m, i) => {
      const slice = carts.filter((_, idx) => idx % MONTHS.length === i)
      const value = slice.reduce((sum, c) => sum + c.total, 0) * (1 + i * 0.15)
      return { label: m, value: Math.round(value) }
    })
  }, [carts])

  const growthData = useMemo(
    () => MONTHS.map((m, i) => ({ label: m, value: 40 + i * 17 + (i % 2 === 0 ? 12 : 0) })),
    []
  )

  const sourceData = useMemo(() => {
    const counts = {}
    pipeline.forEach((d) => {
      counts[d.source] = (counts[d.source] || 0) + 1
    })
    const colors = ['#6F5CFF', '#14B8A6', '#F59E0B', '#F97316', '#16A34A', '#F43F5E']
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }))
  }, [pipeline])

  const avgDealSize = pipeline.length
    ? Math.round(pipeline.reduce((sum, d) => sum + d.value, 0) / pipeline.length)
    : 0

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
          Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Deep-dive into revenue, growth and lead sources
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Average Deal Size</p>
          <p className="text-2xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1">
            {formatCurrency(avgDealSize)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Active Deals</p>
          <p className="text-2xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1">
            {pipeline.filter((d) => !['won', 'lost'].includes(d.stage)).length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Conversion Rate</p>
          <p className="text-2xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1">
            {pipeline.length
              ? Math.round(
                  (pipeline.filter((d) => d.stage === 'won').length / pipeline.length) * 100
                )
              : 0}
            %
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-2">
            Revenue Over Time
          </h3>
          {revenueData.length ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="h-[280px] grid place-items-center text-slate-400 text-sm">Loading…</div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-2">
            Leads by Source
          </h3>
          {sourceData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] grid place-items-center text-slate-400 text-sm">Loading…</div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-2">
          New Customers per Month
        </h3>
        <CustomerGrowthChart data={growthData} />
      </Card>
    </div>
  )
}
