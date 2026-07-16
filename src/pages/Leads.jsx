import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Table from '../components/common/Table'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import { TableSkeleton } from '../components/common/Loader'
import useDebounce from '../hooks/useDebounce'
import { fetchLeads, setLeadPage, setLeadQuery } from '../redux/slices/leadsSlice'
import { formatCurrency } from '../utils/formatters'

const STAGE_TONE = {
  new: 'New',
  contacted: 'Active',
  proposal: 'At Risk',
  negotiation: 'At Risk',
  won: 'Active',
  lost: 'Churned',
}

export default function Leads() {
  const dispatch = useDispatch()
  const { items, total, page, limit, query, status } = useSelector((s) => s.leads)
  const [search, setSearch] = useState(query)
  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    dispatch(setLeadQuery(debouncedSearch))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    dispatch(fetchLeads({ page, limit, query }))
  }, [dispatch, page, limit, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">Leads</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {total} leads tracked across your funnel
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search leads..."
          className="w-full sm:w-72"
        />
      </div>

      <Card className="p-5">
        {status === 'loading' ? (
          <TableSkeleton rows={8} cols={6} />
        ) : (
          <Table columns={['Lead', 'Owner', 'Source', 'Stage', 'Est. Value', 'Probability']}>
            {items.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors">
                <td className="py-3 px-3 pl-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={lead.thumbnail}
                      alt=""
                      className="h-9 w-9 rounded-lg object-cover bg-slate-100"
                    />
                    <div>
                      <p className="font-medium text-navy-900 dark:text-slate-100">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{lead.owner}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{lead.source}</td>
                <td className="py-3 px-3">
                  <Badge tone={STAGE_TONE[lead.stage]}>{lead.stageLabel}</Badge>
                </td>
                <td className="py-3 px-3 font-mono text-navy-900 dark:text-slate-100">
                  {formatCurrency(lead.value)}
                </td>
                <td className="py-3 px-3 pr-0">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-navy-700 overflow-hidden">
                      <div
                        className="h-full bg-brand-500"
                        style={{ width: `${lead.probability}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{lead.probability}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <Pagination page={page} limit={limit} total={total} onPageChange={(p) => dispatch(setLeadPage(p))} />
      </Card>
    </div>
  )
}
