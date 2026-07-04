import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { MesPage } from '@/pages/MesPage'
import { IngresosPage } from '@/pages/IngresosPage'
import { ObligacionesPage } from '@/pages/ObligacionesPage'
import { InversionesPage } from '@/pages/InversionesPage'
import { ObjetivosPage } from '@/pages/ObjetivosPage'
import { AnalisisPage } from '@/pages/AnalisisPage'
import { ConfiguracionPage } from '@/pages/ConfiguracionPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'mes', element: <MesPage /> },
      { path: 'ingresos', element: <IngresosPage /> },
      { path: 'obligaciones', element: <ObligacionesPage /> },
      { path: 'inversiones', element: <InversionesPage /> },
      { path: 'objetivos', element: <ObjetivosPage /> },
      { path: 'analisis', element: <AnalisisPage /> },
      { path: 'configuracion', element: <ConfiguracionPage /> },
    ],
  },
])
