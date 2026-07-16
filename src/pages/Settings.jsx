import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun, Bell, Shield, User } from 'lucide-react'
import Card from '../components/common/Card'
import { toggleDarkMode } from '../redux/slices/uiSlice'
import { useState } from 'react'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`h-6 w-11 rounded-full transition-colors relative shrink-0 ${
        checked ? 'bg-brand-500' : 'bg-slate-200 dark:bg-navy-700'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function Row({ icon: Icon, title, description, right }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-navy-700 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-50 dark:bg-navy-800 grid place-items-center shrink-0">
          <Icon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-navy-900 dark:text-slate-100">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      {right}
    </div>
  )
}

export default function Settings() {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [dealReminders, setDealReminders] = useState(true)

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-slate-100">
          Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your workspace preferences
        </p>
      </div>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-1">
          Appearance
        </h3>
        <Row
          icon={darkMode ? Moon : Sun}
          title="Dark mode"
          description="Switch between light and dark interface themes"
          right={<Toggle checked={darkMode} onChange={() => dispatch(toggleDarkMode())} />}
        />
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-1">
          Notifications
        </h3>
        <Row
          icon={Bell}
          title="Email alerts"
          description="Get notified by email about important account activity"
          right={<Toggle checked={emailAlerts} onChange={() => setEmailAlerts((v) => !v)} />}
        />
        <Row
          icon={Bell}
          title="Deal reminders"
          description="Reminders for deals that need follow-up"
          right={<Toggle checked={dealReminders} onChange={() => setDealReminders((v) => !v)} />}
        />
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-slate-100 mb-1">
          Account
        </h3>
        <Row
          icon={User}
          title="Profile"
          description="Orbit Admin · admin@orbitcrm.io"
          right={
            <button className="text-sm text-brand-600 dark:text-brand-300 hover:underline">
              Edit
            </button>
          }
        />
        <Row
          icon={Shield}
          title="Two-factor authentication"
          description="Add an extra layer of security to your account"
          right={
            <button className="text-sm text-brand-600 dark:text-brand-300 hover:underline">
              Enable
            </button>
          }
        />
      </Card>
    </div>
  )
}
