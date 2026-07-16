import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Phone, MapPin, Building2 } from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Table from '../components/common/Table'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import { TableSkeleton } from '../components/common/Loader'
import useDebounce from '../hooks/useDebounce'
import { fetchCustomers, setPage, setQuery } from '../redux/slices/customersSlice'
import { formatCurrency } from '../utils/formatters'

export default function Customers() {
  const dispatch = useDispatch()
  const { items, total, page, limit, query, status } = useSelector((s) => s.customers)
  const [search, setSearch] = useState(query)
  const debouncedSearch = useDebounce(search)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    dispatch(setQuery(debouncedSearch))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    dispatch(fetchCustomers({ page, limit, query }))
  }, [dispatch, page, limit, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
            Customers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {total} customers in your workspace
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search customers by name..."
          className="w-full sm:w-72"
        />
      </div>

      <Card className="p-5">
        {status === 'loading' ? (
          <TableSkeleton rows={8} cols={6} />
        ) : (
          <Table columns={['Customer', 'Company', 'Contact', 'Status', 'Lifetime Value', '']}>
            {items.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelected(c)}
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
              >
                <td className="py-3 px-3 pl-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover bg-slate-100"
                    />
                    <div>
                      <p className="font-medium text-navy-900 dark:text-slate-100">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.company}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.phone}</td>
                <td className="py-3 px-3">
                  <Badge tone={c.status}>{c.status}</Badge>
                </td>
                <td className="py-3 px-3 font-mono text-navy-900 dark:text-slate-100">
                  {formatCurrency(c.lifetimeValue)}
                </td>
                <td className="py-3 px-3 pr-0 text-right text-brand-600 dark:text-brand-300 text-xs">
                  View →
                </td>
              </tr>
            ))}
          </Table>
        )}
        {!items.length && status === 'succeeded' && (
          <p className="text-center text-sm text-slate-400 py-10">
            No customers match “{query}”.
          </p>
        )}
        <Pagination page={page} limit={limit} total={total} onPageChange={(p) => dispatch(setPage(p))} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Customer Profile">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={selected.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-display font-semibold text-lg text-navy-900 dark:text-slate-100">
                  {selected.firstName} {selected.lastName}
                </p>
                <Badge tone={selected.status}>{selected.status}</Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" /> {selected.email}
              </p>
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" /> {selected.phone}
              </p>
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building2 className="h-4 w-4 text-slate-400" /> {selected.company}
              </p>
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400" />
                {selected.address?.city}, {selected.address?.state}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-navy-700 flex items-center justify-between">
              <span className="text-sm text-slate-500">Lifetime Value</span>
              <span className="font-mono font-semibold text-navy-900 dark:text-slate-100">
                {formatCurrency(selected.lifetimeValue)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
