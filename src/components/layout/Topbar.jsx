import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react'
import {
  openMobileSidebar,
  toggleDarkMode,
  toggleNotifications,
  closeNotifications,
} from '../../redux/slices/uiSlice'
import { fetchNotifications } from '../../redux/slices/notificationsSlice'
import NotificationPanel from '../notifications/NotificationPanel'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/leads': 'Leads',
  '/pipeline': 'Sales Pipeline',
  '/analytics': 'Analytics',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function Topbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { darkMode, notificationsOpen } = useSelector((s) => s.ui)
  const { items } = useSelector((s) => s.notifications)
  const unreadCount = items.filter((n) => !n.read).length
  const panelRef = useRef(null)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Orbit CRM'

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        dispatch(closeNotifications())
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dispatch])

  return (
    <header className="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-6 border-b border-slate-100 dark:border-navy-700 bg-white/80 dark:bg-surface-dark/80 backdrop-blur sticky top-0 z-30">
      <button
        onClick={() => dispatch(openMobileSidebar())}
        className="lg:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="font-display font-semibold text-lg text-navy-900 dark:text-slate-100 hidden sm:block">
        {title}
      </h1>

      <div className="flex-1" />

      <button
        onClick={() => navigate('/customers')}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-sm text-slate-400 w-64 hover:border-brand-300 transition-colors"
      >
        <Search className="h-4 w-4" />
        Quick search customers, leads…
      </button>

      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-500 dark:text-slate-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </button>

      <div className="relative" ref={panelRef}>
        <button
          onClick={() => dispatch(toggleNotifications())}
          className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-500 dark:text-slate-300"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulseDot" />
          )}
        </button>
        {notificationsOpen && <NotificationPanel />}
      </div>

      <button
        onClick={() => navigate('/settings')}
        className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center text-white text-xs font-semibold"
        aria-label="Account settings"
      >
        OC
      </button>
    </header>
  )
}
