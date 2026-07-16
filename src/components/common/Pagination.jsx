import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(total, page * limit)

  const pages = []
  const windowSize = 1
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3 text-sm">
      <p className="text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-navy-900 dark:text-slate-200">{start}-{end}</span> of{' '}
        <span className="font-medium text-navy-900 dark:text-slate-200">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-navy-800"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-brand-500 text-white'
                  : 'border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-navy-800"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
