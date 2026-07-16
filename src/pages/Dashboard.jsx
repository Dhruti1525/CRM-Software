import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Users, TrendingUp, Target, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import RevenueChart from '../components/charts/RevenueChart'
import PipelineChart from '../components/charts/PipelineChart'
import { CardSkeleton } from '../components/common/Loader'
import { fetchCustomers } from '../redux/slices/customersSlice'
import { fetchPipeline } from '../redux/slices/leadsSlice'
import { fetchSales } from '../redux/slices/salesSlice'
import { formatCurrency, formatCompactNumber, initialsOf } from '../utils/formatters'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

function Kpi({ icon: Icon, label, value, delta, positive, loading }) {
  if (loading) return <CardSkeleton />
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1">
            {value}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 grid place-items-center">
          <Icon className="h-5 w-5 text-brand-600 dark:text-brand-300" />
        </div>
      </div>
      <div
        className={`flex items-center gap-1 mt-3 text-xs font-medium ${
          positive ? 'text-emerald-600' : 'text-rose-500'
        }`}
      >
        {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {delta} vs last month
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const { items: customers, total: totalCustomers, status: customersStatus } = useSelector(
    (s) => s.customers
  )
  const { pipeline, pipelineStatus } = useSelector((s) => s.leads)
  const { carts, status: salesStatus } = useSelector((s) => s.sales)

  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 6 }))
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

  const totalRevenue = useMemo(
    () => carts.reduce((sum, c) => sum + c.total, 0) * 8,
    [carts]
  )

  const pipelineChartData = useMemo(() => {
    const stageCounts = {}
    pipeline.forEach((d) => {
      stageCounts[d.stage] = stageCounts[d.stage] || { label: d.stageLabel, color: d.stageColor, count: 0 }
      stageCounts[d.stage].count += 1
    })
    return Object.values(stageCounts)
  }, [pipeline])

  const openDealsValue = useMemo(
    () =>
      pipeline
        .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
        .reduce((sum, d) => sum + d.value, 0),
    [pipeline]
  )

  const wonCount = pipeline.filter((d) => d.stage === 'won').length
  const winRate = pipeline.length ? Math.round((wonCount / pipeline.length) * 100) : 0

  const isLoading = customersStatus === 'loading' || pipelineStatus === 'loading' || salesStatus === 'loading'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
          Welcome back 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Here's what's happening with your pipeline today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi
          icon={Wallet}
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          delta="12.4%"
          positive
          loading={isLoading}
        />
        <Kpi
          icon={Users}
          label="Total Customers"
          value={formatCompactNumber(totalCustomers)}
          delta="8.1%"
          positive
          loading={isLoading}
        />
        <Kpi
          icon={Target}
          label="Open Pipeline Value"
          value={formatCurrency(openDealsValue)}
          delta="4.6%"
          positive
          loading={isLoading}
        />
        <Kpi
          icon={TrendingUp}
          label="Win Rate"
          value={`${winRate}%`}
          delta="2.3%"
          positive={winRate >= 15}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100">
              Revenue Trend
            </h3>
            <Badge tone="Active">Last 7 months</Badge>
          </div>
          {revenueData.length ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="h-[280px] grid place-items-center text-slate-400 text-sm">Loading…</div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-2">
            Pipeline by Stage
          </h3>
          {pipelineChartData.length ? (
            <PipelineChart data={pipelineChartData} />
          ) : (
            <div className="h-[260px] grid place-items-center text-slate-400 text-sm">Loading…</div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100">
            Recent Customers
          </h3>
          <a href="/customers" className="text-sm text-brand-600 dark:text-brand-300 hover:underline">
            View all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-navy-700 hover:border-brand-200 dark:hover:border-brand-500/40 transition-colors"
            >
              <img
                src={c.avatar}
                alt={c.firstName}
                className="h-10 w-10 rounded-full object-cover bg-slate-100"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-navy-900 dark:text-slate-100 truncate">
                  {c.firstName} {c.lastName}
                </p>
                <p className="text-xs text-slate-500 truncate">{c.company}</p>
              </div>
              <Badge tone={c.status}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
