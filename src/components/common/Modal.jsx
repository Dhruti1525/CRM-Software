import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-slideIn"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-xl2 shadow-card-dark border border-slate-100 dark:border-navy-700 animate-slideIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-navy-700">
          <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-500"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
