import { Outlet } from 'react-router-dom'
import { SidebarNav } from '@/components/layouts/Sidebar'
import { TopBar } from '@/components/layouts/TopBar'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
