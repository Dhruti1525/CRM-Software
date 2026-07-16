import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GitBranch,
  BarChart3,
  FileText,
  Settings,
  X,
  ChevronsLeft,
  Orbit,
} from 'lucide-react'
import { closeMobileSidebar, toggleSidebarCollapsed } from '../../redux/slices/uiSlice'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/leads', label: 'Leads', icon: UserPlus },
  { to: '/pipeline', label: 'Sales Pipeline', icon: GitBranch },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ item, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-400 origin-top animate-railGrow" />
          )}
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const dispatch = useDispatch()
  const { sidebarCollapsed, sidebarMobileOpen } = useSelector((s) => s.ui)

  const content = (collapsed) => (
    <div className="flex h-full flex-col bg-navy-900 dark:bg-navy-950">
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shrink-0">
            <Orbit className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-white tracking-tight text-lg">
              Orbit CRM
            </span>
          )}
        </div>
        <button
          onClick={() => dispatch(closeMobileSidebar())}
          className="lg:hidden text-slate-400 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 border-t border-white/5 hidden lg:block">
        <button
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm"
        >
          <ChevronsLeft
            className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-[width] duration-200 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {content(sidebarCollapsed)}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 ${sidebarMobileOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-navy-950/60 transition-opacity ${
            sidebarMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => dispatch(closeMobileSidebar())}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 transition-transform duration-200 ${
            sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {content(false)}
        </div>
      </div>
    </>
  )
}
