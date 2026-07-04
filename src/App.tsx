import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { MonthProvider } from '@/context/MonthContext'
import { router } from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MonthProvider>
        <RouterProvider router={router} />
      </MonthProvider>
    </QueryClientProvider>
  )
}

export default App
