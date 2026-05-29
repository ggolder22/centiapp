import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../../shared/components/Layout'
import ProtectedRoute from '../../shared/components/ProtectedRoute'
import AuthPage from '../../modules/auth/AuthPage'
import Dashboard from '../../modules/finances/Dashboard'
import FinancesPage from '../../modules/finances/FinancesPage'
import CalendarPage from '../../modules/calendar/CalendarPage'
import AssistantPage from '../../modules/assistant/AssistantPage'
import WorkPage from '../../modules/work/WorkPage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'finanzas', element: <FinancesPage /> },
      { path: 'calendario', element: <CalendarPage /> },
      { path: 'asistente', element: <AssistantPage /> },
      { path: 'trabajo', element: <WorkPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default router
