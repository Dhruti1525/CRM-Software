export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-navy-700">
            {columns.map((col) => (
              <th key={col} className="py-3 px-3 font-medium first:pl-0 last:pr-0">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-navy-700">{children}</tbody>
      </table>
    </div>
  )
}
