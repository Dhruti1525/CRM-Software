const TONES = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  New: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300',
  'At Risk': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Churned: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  task: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  deal: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300',
  default: 'bg-slate-100 text-slate-600 dark:bg-navy-700 dark:text-slate-300',
}

export default function Badge({ children, tone = 'default', className = '' }) {
  const style = TONES[tone] || TONES.default
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${style} ${className}`}
    >
      {children}
    </span>
  )
}
