import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card'
import { fetchPipeline, moveDeal, PIPELINE_STAGES } from '../redux/slices/leadsSlice'
import { formatCurrency } from '../utils/formatters'

function DealCard({ deal, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      className="bg-white dark:bg-navy-800 border border-slate-100 dark:border-navy-700 rounded-lg p-3 mb-2.5 cursor-grab active:cursor-grabbing hover:shadow-card transition-shadow"
    >
      <p className="text-sm font-medium text-navy-900 dark:text-slate-100 truncate">{deal.name}</p>
      <p className="text-xs text-slate-400 truncate mb-2">{deal.company}</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-navy-900 dark:text-slate-200">
          {formatCurrency(deal.value)}
        </span>
        <span className="text-[11px] text-slate-400">{deal.owner.split(' ')[0]}</span>
      </div>
    </div>
  )
}

export default function SalesPipeline() {
  const dispatch = useDispatch()
  const { pipeline, pipelineStatus } = useSelector((s) => s.leads)
  const [dragId, setDragId] = useState(null)

  useEffect(() => {
    dispatch(fetchPipeline())
  }, [dispatch])

  const onDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (stageKey) => {
    if (dragId != null) {
      dispatch(moveDeal({ id: dragId, stageKey }))
      setDragId(null)
    }
  }

  const stageTotal = (key) =>
    pipeline.filter((d) => d.stage === key).reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
          Sales Pipeline
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Drag deals between stages to update their status
        </p>
      </div>

      {pipelineStatus === 'loading' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl2 bg-slate-100 dark:bg-navy-700 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const deals = pipeline.filter((d) => d.stage === stage.key)
            return (
              <div
                key={stage.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(stage.key)}
                className="min-w-0"
              >
                <Card className="p-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <h3 className="text-sm font-semibold text-navy-900 dark:text-slate-100">
                        {stage.label}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-navy-700 rounded-full px-1.5 py-0.5">
                      {deals.length}
                    </span>
                  </div>
                  <p className="px-1 text-xs font-mono text-slate-400 mb-3">
                    {formatCurrency(stageTotal(stage.key))}
                  </p>
                  <div className="flex-1 min-h-[120px] max-h-[520px] overflow-y-auto pr-0.5">
                    {deals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
                    ))}
                    {!deals.length && (
                      <p className="text-xs text-slate-300 dark:text-navy-700 text-center py-6">
                        Drop deals here
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
