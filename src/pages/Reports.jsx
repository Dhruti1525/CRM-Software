import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Download, FileSpreadsheet } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Table from '../components/common/Table'
import { fetchPipeline, PIPELINE_STAGES } from '../redux/slices/leadsSlice'
import { formatCurrency } from '../utils/formatters'

export default function Reports() {
  const dispatch = useDispatch()
  const { pipeline } = useSelector((s) => s.leads)

  useEffect(() => {
    dispatch(fetchPipeline())
  }, [dispatch])

  const stageSummary = PIPELINE_STAGES.map((stage) => {
    const deals = pipeline.filter((d) => d.stage === stage.key)
    return {
      ...stage,
      count: deals.length,
      value: deals.reduce((sum, d) => sum + d.value, 0),
    }
  })

  const totalValue = stageSummary.reduce((sum, s) => sum + s.value, 0)

  const downloadCsv = () => {
    const header = 'Stage,Deals,Value\n'
    const rows = stageSummary.map((s) => `${s.label},${s.count},${s.value}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pipeline-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
            Reports
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Pipeline performance summary, ready to export
          </p>
        </div>
        <button
          onClick={downloadCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="h-4 w-4 text-brand-500" />
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100">
            Pipeline Summary by Stage
          </h3>
        </div>
        <Table columns={['Stage', 'Deals', 'Value', 'Share']}>
          {stageSummary.map((s) => (
            <tr key={s.key}>
              <td className="py-3 px-3 pl-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="font-medium text-navy-900 dark:text-slate-100">{s.label}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{s.count}</td>
              <td className="py-3 px-3 font-mono text-navy-900 dark:text-slate-100">
                {formatCurrency(s.value)}
              </td>
              <td className="py-3 px-3 pr-0">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: totalValue ? `${(s.value / totalValue) * 100}%` : '0%',
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {totalValue ? Math.round((s.value / totalValue) * 100) : 0}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Total Pipeline Value</p>
          <p className="text-xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1">
            {formatCurrency(totalValue)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Deals Won</p>
          <p className="text-xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1 flex items-center gap-2">
            {stageSummary.find((s) => s.key === 'won')?.count || 0}
            <Badge tone="Active">closed</Badge>
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Deals Lost</p>
          <p className="text-xl font-display font-bold text-navy-900 dark:text-slate-100 mt-1 flex items-center gap-2">
            {stageSummary.find((s) => s.key === 'lost')?.count || 0}
            <Badge tone="Churned">closed</Badge>
          </p>
        </Card>
      </div>
    </div>
  )
}
