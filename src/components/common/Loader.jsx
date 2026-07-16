export function Spinner({ className = '' }) {
  return (
    <div
      className={`h-5 w-5 rounded-full border-2 border-slate-200 dark:border-navy-700 border-t-brand-500 animate-spin ${className}`}
    />
  )
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="w-full animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-slate-100 dark:border-navy-700">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="h-3 flex-1 rounded bg-slate-100 dark:bg-navy-700" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="h-28 rounded-xl2 bg-slate-100 dark:bg-navy-700 animate-pulse" />
  )
}
