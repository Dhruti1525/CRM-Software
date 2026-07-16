import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-full min-h-[60vh] grid place-items-center text-center px-4">
      <div>
        <Compass className="h-10 w-10 text-brand-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
          The page you're looking for doesn't exist in this workspace.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
