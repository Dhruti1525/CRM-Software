import { useDispatch, useSelector } from 'react-redux'
import { CheckCheck, Bell } from 'lucide-react'
import { markAllRead, markOneRead } from '../../redux/slices/notificationsSlice'
import Badge from '../common/Badge'

export default function NotificationPanel() {
  const dispatch = useDispatch()
  const { items, status } = useSelector((s) => s.notifications)

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-surface-dark border border-slate-100 dark:border-navy-700 rounded-xl2 shadow-card-dark animate-slideIn z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-navy-700">
        <h4 className="font-display font-semibold text-sm text-navy-900 dark:text-slate-100">
          Notifications
        </h4>
        <button
          onClick={() => dispatch(markAllRead())}
          className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-300 hover:underline"
        >
          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {status === 'loading' && (
          <p className="p-4 text-sm text-slate-400">Loading activity…</p>
        )}
        {status === 'succeeded' && items.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="h-6 w-6 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">You're all caught up.</p>
          </div>
        )}
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => dispatch(markOneRead(n.id))}
            className={`w-full text-left px-4 py-3 border-b border-slate-50 dark:border-navy-700 flex gap-3 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors ${
              n.read ? 'opacity-60' : ''
            }`}
          >
            {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500 shrink-0" />}
            {n.read && <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" />}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-navy-900 dark:text-slate-100 truncate">
                  {n.title}
                </p>
                <Badge tone={n.type}>{n.type}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.body}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
