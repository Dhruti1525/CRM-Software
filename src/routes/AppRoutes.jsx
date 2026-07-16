import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Leads from '../pages/Leads'
import SalesPipeline from '../pages/SalesPipeline'
import Analytics from '../pages/Analytics'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/pipeline" element={<SalesPipeline />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
