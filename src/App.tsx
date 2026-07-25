import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { PlanProvider } from '@/context/PlanContext'
import { ToastProvider } from '@/context/ToastContext'
import { router } from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30_000,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <PlanProvider>
          <RouterProvider router={router} />
        </PlanProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
