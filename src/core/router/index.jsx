import { createBrowserRouter } from 'react-router-dom'
import Layout from '../../shared/components/Layout'
import Dashboard from '../../modules/finances/Dashboard'
import FinancesPage from '../../modules/finances/FinancesPage'
import CalendarPage from '../../modules/calendar/CalendarPage'
import AssistantPage from '../../modules/assistant/AssistantPage'
import WorkPage from '../../modules/work/WorkPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'finanzas', element: <FinancesPage /> },
      { path: 'calendario', element: <CalendarPage /> },
      { path: 'asistente', element: <AssistantPage /> },
      { path: 'trabajo', element: <WorkPage /> },
    ],
  },
])

export default router
