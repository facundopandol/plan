import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { PlanProvider } from '@/context/PlanContext'
import { router } from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
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
      <PlanProvider>
        <RouterProvider router={router} />
        <PwaInstallPrompt />
      </PlanProvider>
    </QueryClientProvider>
  )
}

export default App
