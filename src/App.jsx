import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  const darkMode = useSelector((s) => s.ui.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return <AppRoutes />
}
